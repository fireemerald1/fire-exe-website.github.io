// API handler for Resend email service
const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend('re_8Y8oABAy_CTBdNcsHsXw2TQFeMY7iquMm');

/**
 * API handler for sending emails via Resend
 * This can be used with GitHub Actions or any other serverless platform
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { from, fromName, subject, message, to, domain } = req.body;

    // Validate required fields
    if (!from || !subject || !message || !to) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: `${fromName} <onboarding@resend.dev>`, // Use Resend's default sender domain
      reply_to: from, // Set reply-to as the sender's email
      to: [to],
      subject: subject,
      text: `Message from: ${fromName} (${from})\n\nDomain: ${domain || 'Not specified'}\n\n${message}`,
      // You can also use HTML for more formatted emails
      html: `<p><strong>From:</strong> ${fromName} (${from})</p>
             <p><strong>Domain:</strong> ${domain || 'Not specified'}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`
    });

    return res.status(200).json({ ok: true, id: data.id });
  } catch (error) {
    console.error('Resend API error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}
