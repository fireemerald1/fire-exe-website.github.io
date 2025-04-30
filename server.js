// Simple Express server to handle API requests locally
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend('re_8Y8oABAy_CTBdNcsHsXw2TQFeMY7iquMm');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// API endpoint for sending emails
app.post('/api/send-email', async (req, res) => {
  try {
    const { from, fromName, subject, message, to, domain } = req.body;

    // Validate required fields
    if (!from || !subject || !message || !to) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Sending email:', {
      from: fromName,
      to: to,
      subject: subject
    });

    // Send email using Resend
    const data = await resend.emails.send({
      from: `${fromName} <onboarding@resend.dev>`, // Use Resend's default sender domain
      reply_to: from, // Set reply-to as the sender's email
      to: [to],
      subject: subject,
      text: `Message from: ${fromName} (${from})\n\nDomain: ${domain || 'Not specified'}\n\n${message}`,
      html: `<p><strong>From:</strong> ${fromName} (${from})</p>
             <p><strong>Domain:</strong> ${domain || 'Not specified'}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`
    });

    console.log('Email sent successfully:', data.id);
    return res.status(200).json({ ok: true, id: data.id });
  } catch (error) {
    console.error('Resend API error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`- Contact form: http://localhost:${port}/contact.html`);
  console.log(`- Guestbook: http://localhost:${port}/guestbook.html`);
});
