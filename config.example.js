/*
 * config.example.js
 * -----------------
 * This is a TEMPLATE file — safe to commit to GitHub.
 *
 * To set up EmailJS for this project:
 *   1. Copy this file and rename the copy to:  config.js
 *   2. Fill in your real values from https://www.emailjs.com/
 *   3. config.js is listed in .gitignore so your real keys stay private.
 *
 * Where to find each value:
 *   publicKey      → EmailJS dashboard → Account → Public Key
 *   serviceId      → EmailJS dashboard → Email Services → your service
 *   bookingTemplate → EmailJS dashboard → Email Templates → booking confirmation template
 *   newsletterTemplate → EmailJS dashboard → Email Templates → newsletter template
 */

window.EMAILJS_CONFIG = {
    publicKey:          "YOUR_PUBLIC_KEY_HERE",
    serviceId:          "YOUR_SERVICE_ID_HERE",
    bookingTemplate:    "YOUR_BOOKING_TEMPLATE_ID_HERE",
    newsletterTemplate: "YOUR_NEWSLETTER_TEMPLATE_ID_HERE"
};
