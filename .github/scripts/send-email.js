const { Resend } = require('resend');

// Get command line arguments
const name = process.argv[2];
const email = process.argv[3];
const subject = process.argv[4];
const message = process.argv[5];

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail() {
  try {
    // Send email
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Update with your verified domain
      to: 'your-email@example.com', // Update with your email address
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Also send a confirmation email to the user
    await resend.emails.send({
      from: 'Fire Exe <onboarding@resend.dev>', // Update with your verified domain
      to: email,
      subject: 'Thank you for contacting Fire Exe',
      html: `
        <h2>Thank you for contacting Fire Exe</h2>
        <p>Hello ${name},</p>
        <p>Thank you for reaching out. We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p>Best regards,<br>Fire Exe Team</p>
      `,
    });

    console.log('Emails sent successfully:', data);
  } catch (error) {
    console.error('Error sending email:', error);
    process.exit(1);
  }
}

sendEmail();
