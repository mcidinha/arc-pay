const axios = require('axios');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const CIRCLE_BASE_URL = 'https://api.circle.com/v1';

const circleHeaders = {
  'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
  'Content-Type': 'application/json',
};

async function getEntitySecretCiphertext() {
  const entitySecret = process.env.CIRCLE_ENTITY_SECRET;
  const pubKeyRes = await axios.get(`${CIRCLE_BASE_URL}/w3s/config/entity/publicKey`, { headers: circleHeaders });
  const publicKeyPem = pubKeyRes.data.data.publicKey;
  const publicKey = crypto.createPublicKey(publicKeyPem);
  const entitySecretBytes = Buffer.from(entitySecret, 'hex');
  const encrypted = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    entitySecretBytes
  );
  return encrypted.toString('base64');
}

async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_SENDER, pass: process.env.EMAIL_PASSWORD },
  });
  await transporter.sendMail({ from: process.env.EMAIL_SENDER, to, subject, html });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fromWalletId, toAddress, amount, email, recipientEmail } = req.body;
    const entitySecretCiphertext = await getEntitySecretCiphertext();

    const response = await axios.post(
      `${CIRCLE_BASE_URL}/w3s/developer/transactions/transfer`,
      {
        idempotencyKey: crypto.randomUUID(),
        entitySecretCiphertext,
        walletId: fromWalletId,
        amounts: [amount.toString()],
        destinationAddress: toAddress,
        blockchain: 'ARC-TESTNET',
        feeLevel: 'MEDIUM',
        tokenAddress: '0x3600000000000000000000000000000000000000',
      },
      { headers: circleHeaders }
    );

    const transfer = response.data.data;
    const txId = transfer?.id || 'N/A';
    const now = new Date().toLocaleString('pt-BR');

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#020510;color:#fff;padding:32px;border-radius:16px;">
        <h2 style="color:#63b3ff;">ArcPay - Comprovante de Transação</h2>
        <p><b>Valor:</b> ${amount} USDC</p>
        <p><b>Para:</b> ${toAddress}</p>
        <p><b>ID da transação:</b> ${txId}</p>
        <p><b>Data:</b> ${now}</p>
        <p style="color:#4ade80;">✓ Transação confirmada na Arc Testnet</p>
        <hr style="border-color:#1e3a5f;"/>
        <p style="font-size:12px;color:#666;">Arc Testnet · Circle USDC · Built with Claude by mcidinha</p>
      </div>
    `;

    if (email) await sendEmail(email, `ArcPay - Comprovante ${amount} USDC`, emailHtml);
    if (recipientEmail) await sendEmail(recipientEmail, `ArcPay - Você recebeu ${amount} USDC`, emailHtml);

    return res.json({ success: true, transfer });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
};
