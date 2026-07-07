# Laundry Booking Website

## Project Description

This is a Laundry Booking Website made using HTML, CSS and JavaScript. Users can choose laundry services, see the total price, book a service and subscribe to the newsletter. The project also uses EmailJS to send confirmation emails.

---

## Features

- Responsive website
- Laundry service selection
- Shopping cart with total price
- Booking form
- Newsletter subscription
- Confirmation email using EmailJS
- User name displayed in the navigation bar
- Local storage to save selected services

---

## Technologies Used

- HTML5
- CSS3
- JavaScript
- EmailJS
- Font Awesome

---

## Project Files

```
LaundryProject/

│── index.html
│── styles.css
│── script.js
│── README.md
│── washingmachine.png
```

---

# How to Run

1. Download or clone the project.

2. Open the project folder.

3. Open the `index.html` file in your web browser.

The website will work normally, but email confirmation requires EmailJS to be configured.

---

# EmailJS Setup

## Step 1

Go to:

https://www.emailjs.com/

Create a free EmailJS account.

---

## Step 2

Add an Email Service.

You can connect Gmail or another email provider.

Copy your **Service ID**.

Example:

```
service_xxxxxxx
```

---

## Step 3

Create a template for booking confirmation.

Copy the Template ID.

Example:

```
template_booking
```

Create another template for the newsletter.

Copy that Template ID as well.

Example:

```
template_newsletter
```

---

## Step 4

Open **Account** in EmailJS.

Copy your **Public Key**.

Example:

```
ABCD1234XYZ
```

---

## Step 5

Open **index.html**

Replace

```javascript
emailjs.init("YOUR_PUBLIC_KEY");
```

with

```javascript
emailjs.init("YOUR_PUBLIC_KEY_HERE");
```

---

## Step 6

Open **script.js**

Replace

```javascript
YOUR_SERVICE_ID
```

with your Service ID.

Replace

```javascript
YOUR_BOOKING_TEMPLATE
```

with your Booking Template ID.

Replace

```javascript
YOUR_NEWSLETTER_TEMPLATE
```

with your Newsletter Template ID.

Save the files and refresh the browser.

---

## How to Use

1. Open the website.

2. Add one or more laundry services.

3. The selected services will appear in the cart.

4. Enter your:
   - Name
   - Email
   - Phone Number

5. Click **Book Now**.

6. If EmailJS is configured correctly, a confirmation email will be sent.

7. Your name will appear in the navigation bar after booking.

8. You can also subscribe using the newsletter form.

---

## Future Improvements

- Online payment
- User login
- Booking history
- Order tracking
- Admin dashboard

---

## Author

Student Project

---

## License

This project was created for educational purposes only.