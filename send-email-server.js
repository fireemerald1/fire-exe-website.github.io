// Simple Express server to send emails from contact form
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Allow cross-origin requests
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { subject, email, message } = req.body;
  if (!subject || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields required.' });
  }

  // Always use environment variables for security
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  // Check if credentials are provided
  if (!emailUser || !emailPass) {
    return res.status(500).json({ success: false, error: 'Email configuration missing. Set EMAIL_USER and EMAIL_PASS environment variables.' });
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: emailUser, // Where you want to receive emails
      subject,
      text: `Message from: ${email}\n\n${message}`,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`Email server running on port ${PORT}`));
