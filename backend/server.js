require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const CIRCLE_BASE_URL = 'https://api.circle.com/v1/w3s';
const circleHeaders = {
  'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
  'Content-Type': 'application/json'
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendComprovante({ toEmail, amount, toAddress, transferId }) {
  if (!toEmail) return;
  try {
    await transporter.sendMail({
      from: `"ArcPay" <${process.env.EMAIL_SENDER}>`,
      to: toEmail,
      subject: 'Comprovante de Pagamento - ArcPay',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a1a; color: #fff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #7B5FFF; margin-bottom: 8px;">ArcPay</h1>
          <p style="color: #888; margin-bottom: 32px;">Arc Testnet - Circle USDC</p>
          <div style="background: rgba(123,95,255,0.1); border: 1px solid rgba(123,95,255,0.3); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
            <p style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Valor Enviado</p>
            <p style="font-size: 48px; font-weight: 900; color: #fff; margin: 0;">${amount}</p>
            <p style="color: #888; margin-top: 4px;">USDC</p>
          </div>
          <div style="margin-bottom: 16px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 4px;">ENDERECO DESTINO</p>
            <p style="font-family: monospace; font-size: 13px; color: #7B5FFF; word-break: break-all;">${toAddress}</p>
          </div>
          <div style="margin-bottom: 24px;">
            <p style="color: #888; font-size: 12px; margin-bottom: 4px;">ID DA TRANSACAO</p>
            <p style="font-family: monospace; font-size: 12px; color: #555; word-break: break-all;">${transferId || 'N/A'}</p>
          </div>
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; text-align: center;">
            <p style="color: #555; font-size: 12px;">Pagamento processado via Arc Testnet</p>
            <p style="color: #555; font-size: 11px; margin-top: 4px;">Built with Claude by mcidinha</p>
          </div>
        </div>
      `
    });
    console.log('Comprovante enviado para:', toEmail);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error.message);
  }
}

async function getEntitySecretCiphertext() {
  const pubKeyResponse = await axios.get(`${CIRCLE_BASE_URL}/config/entity/publicKey`, {
    headers: circleHeaders
  });
  const publicKey = pubKeyResponse.data.data.publicKey;
  const entitySecretBuffer = Buffer.from(process.env.CIRCLE_ENTITY_SECRET, 'hex');
  const encrypted = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    entitySecretBuffer
  );
  return encrypted.toString('base64');
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ArcPay backend funcionando!' });
});

app.post('/wallet/get-or-create', async (req, res) => {
  try {
    const { userId, email } = req.body;
    console.log("RECEBIDO:", { userId, email });

    // Buscar usuario pelo email primeiro
    let resolvedUserId = userId;
    if (email) {
      let { data: userByEmail } = await supabase
        .from('users').select('id').eq('email', email).single();
      if (userByEmail) {
        resolvedUserId = userByEmail.id;
      }
    }

    let { data: userRecord } = await supabase
      .from('users').select('id').eq('id', resolvedUserId).single();

    if (!userRecord) {
      await supabase.from('users').insert({ id: resolvedUserId, email: email || null });
    }

    let { data: walletRecord } = await supabase
      .from('wallets').select('*').eq('user_id', resolvedUserId).eq('blockchain', 'ARC-TESTNET').single();

    if (walletRecord) {
      let balance = '0';
      try {
        const balanceRes = await axios.get(
          `${CIRCLE_BASE_URL}/wallets/${walletRecord.circle_wallet_id}/balances`,
          { headers: circleHeaders }
        );
        const tokenBalances = balanceRes.data.data.tokenBalances;
        if (tokenBalances && tokenBalances.length > 0) {
          balance = tokenBalances[0].amount;
        }
      } catch (e) {
        console.log('Erro ao buscar saldo:', e.message);
      }
      return res.json({ success: true, wallet: walletRecord, balance });
    }

    const entitySecretCiphertext1 = await getEntitySecretCiphertext();
    const walletSetResponse = await axios.post(`${CIRCLE_BASE_URL}/developer/walletSets`, {
      idempotencyKey: crypto.randomUUID(),
      entitySecretCiphertext: entitySecretCiphertext1,
      name: `WalletSet-${userId}`
    }, { headers: circleHeaders });

    const walletSetId = walletSetResponse.data.data.walletSet.id;

    const entitySecretCiphertext2 = await getEntitySecretCiphertext();
    const walletResponse = await axios.post(`${CIRCLE_BASE_URL}/developer/wallets`, {
      idempotencyKey: crypto.randomUUID(),
      entitySecretCiphertext: entitySecretCiphertext2,
      walletSetId,
      blockchains: ['ARC-TESTNET'],
      count: 1
    }, { headers: circleHeaders });

    const wallet = walletResponse.data.data.wallets[0];

    await supabase.from('wallets').insert({
      user_id: resolvedUserId,
      circle_wallet_id: wallet.id,
      blockchain: wallet.blockchain,
      address: wallet.address
    });

    res.json({ success: true, wallet: { circle_wallet_id: wallet.id, address: wallet.address, blockchain: wallet.blockchain }, balance: '0' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

app.post('/payment/send', async (req, res) => {
  try {
    const { fromWalletId, toAddress, amount, email } = req.body;
    const entitySecretCiphertext = await getEntitySecretCiphertext();

    const response = await axios.post(`${CIRCLE_BASE_URL}/developer/transactions/transfer`, {
      idempotencyKey: crypto.randomUUID(),
      entitySecretCiphertext,
      walletId: fromWalletId,
      amounts: [amount.toString()],
      destinationAddress: toAddress,
      blockchain: 'ARC-TESTNET',
      feeLevel: 'MEDIUM',
      tokenAddress: '0x3600000000000000000000000000000000000000'
    }, { headers: circleHeaders });

    const transfer = response.data.data;

    await sendComprovante({
      toEmail: email,
      amount,
      toAddress,
      transferId: transfer?.id
    });

    res.json({ success: true, transfer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`ArcPay backend rodando na porta ${PORT}`);
});