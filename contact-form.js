// JS to handle contact form submission using Formspree
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
    
    // Get configuration from config.js (which is not uploaded to GitHub)
    // If CONFIG is not defined, use fallback values for local development only
    const formspreeUrl = typeof CONFIG !== 'undefined' ? CONFIG.FORMSPREE_ENDPOINT : null;
    const allowedDomains = typeof CONFIG !== 'undefined' ? CONFIG.ALLOWED_DOMAINS : ['localhost', '127.0.0.1', "https://fireemerald1.github.io/fire-exe-website.github.io", "https://fireexe.is-a.dev"];
    
    // If config is missing, show error
    if (!formspreeUrl) {
      statusDiv.textContent = 'Configuration error. Please contact the site administrator.';
      statusDiv.style.color = '#800000';
      submitBtn.disabled = false;
      return;
    }
    
    // Domain verification - only allow submissions from your domain
    const currentDomain = window.location.hostname;
    
    if (!allowedDomains.includes(currentDomain)) {
      statusDiv.textContent = 'Form submission not allowed from this domain.';
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
    
    const res = await fetch(formspreeUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': window.location.origin // Send origin header for additional verification
      },
      body: JSON.stringify({ 
        name,
        email, 
        subject, 
        message,
        _domain: currentDomain // Send domain info to help with filtering
      })
    });
    
    const result = await res.json();
    if (result.ok) {
      // Store submission time for rate limiting
      localStorage.setItem('lastFormSubmission', now.toString());
      
      // Hide the form and show the success message
      formElement.style.display = 'none';
      successMessage.style.display = 'block';
      
      // Add animation to the success message
      successMessage.style.animation = 'fadeIn 0.5s ease-in-out';
      
      // Clear form for next time
      formElement.reset();
    } else {
      statusDiv.textContent = 'Error: ' + (result.error || 'Could not send email.');
      statusDiv.style.color = '#800000'; // Using the darker red color
    }
  } catch (err) {
    statusDiv.textContent = 'Network error. Please try again later.';
    statusDiv.style.color = '#800000'; // Using the darker red color
  } finally {
    submitBtn.disabled = false;
  }
}

// Function to show the form again when "Send Another Message" is clicked
function showFormAgain() {
  const formElement = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');
  
  successMessage.style.display = 'none';
  formElement.style.display = 'flex';
}

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
  
  // Add event listener to the "Send Another Message" button
  if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', showFormAgain);
    
    // Add hover effect to the send another button
    sendAnotherBtn.addEventListener('mouseover', function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 0 15px rgba(0, 119, 119, 0.5)';
    });
    sendAnotherBtn.addEventListener('mouseout', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
  }
});
