# Laundry Booking Website

## Project Description

A front-end laundry booking site built with HTML, CSS and vanilla JavaScript.
Users can pick services, see a running cart total, submit a booking form, and
subscribe to a newsletter. Confirmation emails are sent through EmailJS.

---

## Features

- Responsive layout (mobile stacking via media query)
- Service selection with a live cart
- LocalStorage persistence — cart survives a page refresh
- Booking form with **inline field validation** (no browser alert popups)
- **Distinct success vs. error feedback** after submitting the booking form
- Newsletter subscription with inline feedback
- User name displayed in the navbar after a successful booking
- Confirmation emails via EmailJS

---

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- [EmailJS](https://www.emailjs.com/) (free tier)
- Font Awesome 6

---

## Project Files

```
JS-9/
├── index.html           ← page structure and section comments
├── styles.css           ← all styling, section comments, mobile breakpoint
├── script.js            ← cart logic, validation, EmailJS calls
├── config.js            ← YOUR real credentials (gitignored — never commit this)
├── config.example.js    ← safe placeholder to show reviewers what to fill in
├── .gitignore           ← ensures config.js is never pushed to GitHub
├── washingmachine.png
└── README.md
```

---

## Security: Why credentials live in `config.js`

Hardcoding API keys directly in `script.js` or `index.html` is a problem
because **anyone who views the page source can read them**. Rotating exposed
keys is painful; using environment variables or a backend proxy is the correct
long-term solution, but for this pure front-end project the accepted approach is:

1. Store credentials in a separate file (`config.js`) as a global JS object.
2. Add `config.js` to `.gitignore` so it is never committed to version control.
3. Ship `config.example.js` (placeholders only) so other developers know exactly
   what to fill in.

> **If you accidentally commit `config.js`**, rotate your EmailJS public key
> immediately from the EmailJS dashboard → Account → Public Key.

---

## How to Run

1. Clone or download the project folder.
2. **Copy** `config.example.js` and rename the copy to `config.js`.
3. Fill in your real EmailJS credentials inside `config.js` (see setup below).
4. Open `index.html` in any modern browser.

The site works fully without a local server.
Email confirmation requires valid EmailJS credentials in `config.js`.

---

## EmailJS Setup

### Step 1 — Create an account

Go to <https://www.emailjs.com/> and sign up for a free account.

### Step 2 — Add an Email Service

- Dashboard → **Email Services** → Add Service (connect Gmail or another provider)
- Copy your **Service ID** (looks like `service_xxxxxxx`)

### Step 3 — Create two Email Templates

**Booking confirmation template** — variables used:

| Variable | Description |
|---|---|
| `{{customer_name}}` | Customer's full name |
| `{{customer_email}}` | Customer's email |
| `{{phone}}` | Phone number |
| `{{services}}` | Comma-separated list of booked services |
| `{{total}}` | Total price in dollars |

Copy the **Template ID** (looks like `template_xxxxxxx`).

**Newsletter template** — variables used:

| Variable | Description |
|---|---|
| `{{customer_name}}` | Subscriber's name |
| `{{customer_email}}` | Subscriber's email |

Copy that **Template ID** too.

### Step 4 — Get your Public Key

Dashboard → **Account** → **Public Key** (looks like `ABCD1234XYZ`)

### Step 5 — Fill in `config.js`

Open your local `config.js` (not `config.example.js`) and replace the placeholders:

```js
window.EMAILJS_CONFIG = {
    publicKey:          "your_real_public_key",
    serviceId:          "service_xxxxxxx",
    bookingTemplate:    "template_xxxxxxx",
    newsletterTemplate: "template_yyyyyyy"
};
```

Save the file and refresh the browser. That's it — **no changes to `index.html`
or `script.js` are needed**.

---

## How to Use

1. Open the site in a browser.
2. Click **Add** on one or more services — they appear in the cart on the left.
3. Fill in your Name, Email and Phone in the booking form.
4. Click **Book Now**.
   - ✅ If the email sends successfully → green banner with your email address shown.
   - ⚠️ If the email fails → amber banner telling you the booking was received but
     the confirmation could not be sent. **Your cart is kept** so you can try again.
5. To subscribe, enter your name and email in the Newsletter section at the bottom.

---

## Feedback Behaviour (Success vs. Error)

| Scenario | What the user sees |
|---|---|
| Email sent successfully | Green banner: "Booking confirmed! A confirmation email has been sent to `email`." |
| Email failed (wrong key, network, quota) | Amber banner: "Your booking details were received, but the confirmation email could not be sent…" — cart is **not** cleared |
| Newsletter sent | White text: "You're subscribed! Check your inbox for a welcome email." |
| Newsletter failed | Yellow text: "Subscription saved, but the welcome email could not be sent right now." |

---

## Future Improvements

- Backend proxy to fully hide EmailJS credentials server-side
- Online payment integration
- User login and booking history
- Order tracking
- Admin dashboard

---

## Author

Student Project

---

## License

Created for educational purposes only.