const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { to, invoiceNumber, from, toAddress, amount, description, txHash } = req.body;

    if (!to) return res.status(400).json({ error: 'Email destinatario ausente' });

    const explorerUrl = txHash ? `https://testnet.arcscan.app/tx/${txHash}` : '';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; color: #fff; padding: 24px;">
          <h1 style="margin: 0; font-size: 20px;">Arc Pay - Invoice</h1>
          <p style="margin: 4px 0 0; color: #93c5fd; font-size: 13px;">Pagamento registrado onchain na Arc Testnet</p>
        </div>
        <div style="padding: 24px; color: #111827;">
          <p style="font-size: 22px; font-weight: 700; margin: 0 0 16px;">Invoice Nº ${invoiceNumber || '-'}</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #6b7280;">Descrição</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${description || '-'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Valor</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${amount || '-'} USDC</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">De</td><td style="padding: 8px 0; text-align: right; font-size: 12px; word-break: break-all;">${from || '-'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Para</td><td style="padding: 8px 0; text-align: right; font-size: 12px; word-break: break-all;">${toAddress || '-'}</td></tr>
          </table>
          ${explorerUrl ? `<a href="${explorerUrl}" style="display: inline-block; margin-top: 20px; background: #2563eb; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 14px;">Ver comprovante onchain</a>` : ''}
          <p style="margin-top: 24px; font-size: 11px; color: #9ca3af;">Este registro é permanente e auditável na blockchain Arc Testnet.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to,
      subject: `Invoice Nº ${invoiceNumber || ''} - Arc Pay`,
      html,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar email da invoice:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
