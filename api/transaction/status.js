const axios = require('axios');
const CIRCLE_BASE_URL = 'https://api.circle.com/v1';
const circleHeaders = {
  'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`,
  'Content-Type': 'application/json',
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { transferId } = req.body;
    if (!transferId) return res.status(400).json({ error: 'transferId required' });

    const txDetails = await axios.get(
      `${CIRCLE_BASE_URL}/w3s/transactions/${transferId}`,
      { headers: circleHeaders }
    );

    const transaction = txDetails.data.data.transaction;
    const txHash = transaction?.txHash || '';
    const state = transaction?.state || '';

    console.log('state:', state, 'txHash:', txHash);

    return res.json({ success: true, txHash, state });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
};
