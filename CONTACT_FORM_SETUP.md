# Contact Form Setup with GitHub Actions and Resend

This document explains how to set up the contact form to work with GitHub Actions and Resend for sending emails.

## Overview

Since GitHub Pages is a static site hosting service, it cannot run server-side code directly. To overcome this limitation and avoid CORS issues with direct API calls to Resend, we use GitHub Actions as a serverless backend to handle form submissions and send emails.

## Setup Instructions

### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token" (classic)
3. Give it a descriptive name like "Contact Form"
4. Select the `repo` scope (this allows the token to trigger workflows)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately as you won't be able to see it again

### 2. Set up Resend

1. Sign up for a [Resend](https://resend.com) account if you don't have one
2. Verify your domain or use the default Resend domain for testing
3. Get your API key from the Resend dashboard

### 3. Configure GitHub Repository Secrets

1. Go to your GitHub repository settings
2. Click on "Secrets and variables" > "Actions"
3. Add a new repository secret named `RESEND_API_KEY` with your Resend API key as the value

### 4. Create config.js File

1. Copy the `config.js.example` file to `config.js`
2. Replace the placeholder value with your actual GitHub Personal Access Token:
   ```javascript
   const CONFIG = {
     GITHUB_TOKEN: 'your-github-personal-access-token-here'
   };
   ```
3. **IMPORTANT**: Do not commit this file to your repository as it contains sensitive information

### 5. How It Works

1. When a user submits the contact form, the JavaScript sends the form data to GitHub's repository dispatch API
2. This triggers the GitHub Actions workflow defined in `.github/workflows/contact-form.yml`
3. The workflow runs a Node.js script that uses Resend to send the email
4. Both the form submission and email sending happen asynchronously

## Troubleshooting

- **Form submission fails**: Check that your GitHub token is correct and has the proper permissions
- **Emails not being sent**: Verify that the `RESEND_API_KEY` secret is set correctly in your GitHub repository
- **Rate limiting issues**: GitHub API has rate limits, so very frequent form submissions might be throttled

## Security Considerations

- The GitHub token in `config.js` should be kept private and not committed to the repository
- Consider implementing additional spam protection like reCAPTCHA
- The current implementation includes basic rate limiting (one submission per minute)
