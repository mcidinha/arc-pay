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
    const transferId = transfer?.id || '';

    // Aguarda 4 segundos e busca o txHash real na blockchain
    await new Promise(resolve => setTimeout(resolve, 4000));
    let txHash = '';
    try {
      const txDetails = await axios.get(
        `${CIRCLE_BASE_URL}/w3s/developer/transactions/${transferId}`,
        { headers: circleHeaders }
      );
      txHash = txDetails.data.data.txHash || '';
    } catch (e) {
      console.error('Erro ao buscar txHash:', e.message);
    }

    const explorerUrl = txHash
      ? `https://testnet.arcscan.app/tx/${txHash}`
      : '';
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const nowUTC = new Date().toUTCString();
    const emailHtml = `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#020510;color:#fff;padding:32px;border-radius:16px;">
        <h2 style="color:#63b3ff;">ArcPay - Transaction Receipt</h2>
        <p><b>Amount:</b> ${amount} USDC</p>
        <p><b>To:</b> ${toAddress}</p>
        <p><b>Transaction ID:</b> ${transferId}</p>
        ${txHash ? `<p><b>TX Hash:</b> ${txHash}</p>` : ''}
        <p><b>Date (Brasília):</b> ${now}</p>
        <p><b>Date (UTC):</b> ${nowUTC}</p>
        <p style="color:#4ade80;">✓ Transaction confirmed on Arc Testnet</p>
        ${explorerUrl ? `
        <div style="margin-top:16px;">
          <a href="${explorerUrl}" target="_blank"
            style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#3b6ef7,#1d4ed8);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:13px;">
            🔍 View on Arc Testnet Explorer
          </a>
        </div>` : ''}
        <hr style="border-color:#1e3a5f;margin-top:24px;"/>
        <p style="font-size:12px;color:#666;">Arc Testnet · Circle USDC · Built with Claude by mcidinha</p>
      </div>
    `;
    if (email) await sendEmail(email, `ArcPay - Receipt ${amount} USDC`, emailHtml);
    if (recipientEmail) await sendEmail(recipientEmail, `ArcPay - You received ${amount} USDC`, emailHtml);
    return res.json({ success: true, transfer, txHash });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
};