const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const crypto = require('crypto');

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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { userId, email } = req.body;

    let resolvedUserId = userId;
    if (email) {
      const { data: existingUser } = await supabase
        .from('wallets').select('user_id').eq('email', email).single();
      if (existingUser) resolvedUserId = existingUser.user_id;
    }

    const { data: existingWallet } = await supabase
      .from('wallets').select('*').eq('user_id', resolvedUserId).single();

    if (existingWallet) {
      const balanceRes = await axios.get(
        `${CIRCLE_BASE_URL}/w3s/wallets/${existingWallet.circle_wallet_id}/balances`,
        { headers: circleHeaders }
      );
      const balances = balanceRes.data.data.tokenBalances || [];
      const usdc = balances.find(b => b.token?.symbol === 'USDC');
      const balance = usdc ? usdc.amount : '0';
      return res.json({ success: true, wallet: existingWallet, balance });
    }

    const entitySecretCiphertext = await getEntitySecretCiphertext();
    const walletRes = await axios.post(
      `${CIRCLE_BASE_URL}/w3s/developer/wallets`,
      {
        idempotencyKey: crypto.randomUUID(),
        entitySecretCiphertext,
        blockchains: ['ARC-TESTNET'],
        count: 1,
      },
      { headers: circleHeaders }
    );

    const wallet = walletRes.data.data.wallets[0];
    await supabase.from('wallets').insert({
      user_id: resolvedUserId,
      email: email || null,
      circle_wallet_id: wallet.id,
      blockchain: wallet.blockchain,
      address: wallet.address,
    });

    return res.json({ success: true, wallet: { circle_wallet_id: wallet.id, address: wallet.address, blockchain: wallet.blockchain }, balance: '0' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
};
