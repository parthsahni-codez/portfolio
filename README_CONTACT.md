Contact form setup

This project includes a client-side contact form handler in `script.js`.

How it works

- By default the script will open the user's mail client (`mailto:`) as a fallback.
- For reliable email delivery, configure Formspree and set your form ID in `script.js`.

Steps to configure Formspree (recommended)

1. Visit https://formspree.io and sign up for a free account.
2. Create a new form and note the Form ID (it looks like `mknqzqdo`).
3. Open `script.js` and find the line:

   const FORMSPREE_FORM_ID = 'YOUR_FORMSPREE_FORM_ID';

   Replace `'YOUR_FORMSPREE_FORM_ID'` with your actual Formspree ID.

4. Deploy your site (Formspree works from static sites). Submissions will be forwarded to the email address you verified with Formspree.

Testing locally

- If you don't configure Formspree, submitting the form will open your default mail client prefilled with the message.
- After adding a Formspree ID, submit the form and check your Formspree dashboard or email for incoming messages.

Alternative: EmailJS

- If you prefer client-side SMTP without redirecting users, consider EmailJS (https://www.emailjs.com/). It requires creating an account and adding your user/service/template IDs to the script.

Security note

- Avoid embedding private SMTP credentials in client-side code. Use a server-side endpoint or a service like Formspree/EmailJS that is designed for static sites.
