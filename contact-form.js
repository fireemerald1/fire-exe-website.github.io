// JS to handle contact form submission using GitHub Actions and Resend
async function sendContactForm(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value;
  const subject = document.getElementById('contact-subject').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;
  const statusDiv = document.getElementById('contact-status');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const formElement = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');
  
  // Clear previous status and disable button
  statusDiv.textContent = 'Sending...';
  statusDiv.style.color = '#00ffff';
  submitBtn.disabled = true;
  
  try {
    // Check for bad words in the message, name, and subject
    const textToCheck = `${name} ${subject} ${message}`;
    const hasBadWords = await containsBadWords(textToCheck);
    
    if (hasBadWords) {
      statusDiv.textContent = 'Message contains inappropriate content and cannot be sent.';
      statusDiv.style.color = '#800000';
      submitBtn.disabled = false;
      return;
    }
    
    // Add rate limiting - store last submission time
    const lastSubmission = localStorage.getItem('lastFormSubmission');
    const now = new Date().getTime();
    
    // If submitted in the last 60 seconds, prevent submission
    if (lastSubmission && (now - parseInt(lastSubmission)) < 60000) {
      statusDiv.textContent = 'Please wait a minute before sending another message.';
      statusDiv.style.color = '#800000';
      submitBtn.disabled = false;
      return;
    }
    
    // GitHub repository dispatch API endpoint
    // Replace with your GitHub username and repository name
    const githubApiUrl = 'https://api.github.com/repos/fireemerald1/fire-exe-website.github.io/dispatches';
    
    // Get the GitHub personal access token from local storage or config
    // This token should be set by the site owner in the config.js file
    const githubToken = typeof CONFIG !== 'undefined' ? CONFIG.GITHUB_TOKEN : '';
    
    if (!githubToken) {
      statusDiv.textContent = 'Configuration error. GitHub token not found.';
      statusDiv.style.color = '#800000';
      submitBtn.disabled = false;
      return;
    }
    
    // Send the form data to GitHub repository dispatch API
    const res = await fetch(githubApiUrl, {
      method: 'POST',
      headers: { 
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'contact-form-submission',
        client_payload: { 
          name,
          email,
          subject,
          message,
          timestamp: new Date().toISOString()
        }
      })
    });
    
    if (res.status === 204) {
      // Store submission time for rate limiting
      localStorage.setItem('lastFormSubmission', now.toString());
      
      // Show success message inline instead of hiding the form
      statusDiv.textContent = 'Email sent successfully! Thank you for your message.';
      statusDiv.style.color = '#00ffff';
      
      // Clear the form fields
      formElement.reset();
    } else {
      const errorData = await res.json().catch(() => ({}));
      statusDiv.textContent = 'Error: ' + (errorData.message || 'Could not send email.');
      statusDiv.style.color = '#800000';
    }
  } catch (err) {
    console.error('Error submitting form:', err);
    statusDiv.textContent = 'Network error. Please try again later.';
    statusDiv.style.color = '#800000';
  } finally {
    submitBtn.disabled = false;
  }
}

// We no longer need the showFormAgain function since we're not hiding the form

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const sendAnotherBtn = document.getElementById('send-another');
  
  if (form) {
    form.addEventListener('submit', sendContactForm);
    
    // Add hover effect to the submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 15px rgba(0, 119, 119, 0.5)';
      });
      submitBtn.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
      });
    }
  }
  
  // We no longer need the 'Send Another Message' button functionality
});
