/*
 * script.js — Laundry Booking App
 * --------------------------------
 * Handles three things:
 *   1. Cart — add/remove services, persist to localStorage so a page
 *             refresh doesn't wipe out what the user selected.
 *   2. Booking form — validate input inline (no alert() popups),
 *             then send a confirmation email via EmailJS.
 *   3. Newsletter form — validate and send a subscription email.
 *
 * Credentials come from window.EMAILJS_CONFIG which is defined in
 * config.js (gitignored). That file is loaded before this one in index.html.
 */


/* ============================================================
   EMAILJS — initialise with the public key from config.js
   This replaces the old hardcoded emailjs.init("...") in HTML.
   ============================================================ */
emailjs.init(window.EMAILJS_CONFIG.publicKey);


/* ============================================================
   DOM REFERENCES
   Grabbing everything we need once at the top is cleaner than
   calling getElementById every time a function runs.
   ============================================================ */
const cartList      = document.getElementById("selectedItems");
const totalDisplay  = document.getElementById("totalPrice");
const bookingForm   = document.getElementById("bookingForm");
const newsletterForm= document.getElementById("newsletterForm");
const successMsg    = document.getElementById("successMessage");
const errorMsg      = document.getElementById("errorMessage");
const userNameEl    = document.getElementById("userName");
const submitBtn     = document.getElementById("submitBtn");
const newsletterFeedback = document.getElementById("newsletterFeedback");


/* ============================================================
   CART STATE
   A plain array of { name, price } objects.
   Loaded from localStorage on page load so cart survives refresh.
   ============================================================ */
let cart = [];

if (localStorage.getItem("laundryCart")) {
    // Parse the saved JSON back into a JS array
    cart = JSON.parse(localStorage.getItem("laundryCart"));
    renderCart();  // immediately draw what was saved
}


/* ============================================================
   CART FUNCTIONS
   ============================================================ */

// addService — called by the inline onclick on each service button.
// We push an object (not just a string) so we keep name and price together.
function addService(name, price) {
    cart.push({ name: name, price: price });
    saveCart();
    renderCart();
}

// removeService — called by the Remove button inside each cart row.
// splice(index, 1) deletes exactly one item at that position.
function removeService(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// saveCart — write the current array to localStorage as JSON.
// Kept as its own function so both add and remove use the same logic.
function saveCart() {
    localStorage.setItem("laundryCart", JSON.stringify(cart));
}

// renderCart — rebuild the <ul> from scratch each time the cart changes.
// Also recalculates and displays the running total.
function renderCart() {
    cartList.innerHTML = "";  // clear old list items first
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price;

        // Build a list item with the service name, price, and a remove button.
        // The button passes its own index so removeService knows which item to delete.
        let item = document.createElement("li");
        item.innerHTML =
            cart[i].name + " — $" + cart[i].price +
            ' <button class="remove-btn" onclick="removeService(' + i + ')">Remove</button>';

        cartList.appendChild(item);
    }

    totalDisplay.textContent = total;
}


/* ============================================================
   VALIDATION HELPERS
   Instead of alert() popups (which block the page and feel old),
   we show small red hints directly under each field.
   ============================================================ */

// showFieldError — put an error message under a field and mark the input red.
function showFieldError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("input-error");
    document.getElementById(errorId).textContent = message;
}

// clearFieldError — reset a field back to normal once it looks valid.
function clearFieldError(inputId, errorId) {
    document.getElementById(inputId).classList.remove("input-error");
    document.getElementById(errorId).textContent = "";
}

// validateBookingForm — runs all checks, returns true only if everything passes.
// Returns false as soon as it finds a problem so multiple errors can be shown at once.
function validateBookingForm(name, email, phone) {
    let valid = true;

    // Name: must not be empty
    if (name === "") {
        showFieldError("name", "nameError", "Please enter your full name.");
        valid = false;
    } else {
        clearFieldError("name", "nameError");
    }

    // Email: must contain @ and a dot after it — basic sanity check
    if (email === "") {
        showFieldError("email", "emailError", "Please enter your email address.");
        valid = false;
    } else if (!email.includes("@") || email.indexOf(".") < email.indexOf("@")) {
        showFieldError("email", "emailError", "That doesn't look like a valid email.");
        valid = false;
    } else {
        clearFieldError("email", "emailError");
    }

    // Phone: must be at least 10 digits (strips spaces/dashes before counting)
    let digitsOnly = phone.replace(/\D/g, "");
    if (phone === "") {
        showFieldError("phone", "phoneError", "Please enter your phone number.");
        valid = false;
    } else if (digitsOnly.length < 10) {
        showFieldError("phone", "phoneError", "Phone number must have at least 10 digits.");
        valid = false;
    } else {
        clearFieldError("phone", "phoneError");
    }

    return valid;
}


/* ============================================================
   BOOKING FORM SUBMISSION
   ============================================================ */
bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();  // stop the browser from reloading the page

    // Hide any leftover feedback from a previous attempt
    successMsg.style.display = "none";
    successMsg.textContent   = "";
    errorMsg.style.display   = "none";
    errorMsg.textContent     = "";

    // Collect and trim values (trim removes accidental leading/trailing spaces)
    let name  = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();

    // Run validation — stop here if anything is wrong
    if (!validateBookingForm(name, email, phone)) {
        return;
    }

    // Cart check — must have at least one service
    if (cart.length === 0) {
        errorMsg.textContent   = "Please add at least one service to your cart before booking.";
        errorMsg.style.display = "block";
        return;
    }

    // Build the services string and total for the email template
    let total    = 0;
    let services = cart.map(function (item) {
        total += item.price;
        return item.name;
    }).join(", ");

    // Disable the button while the email is being sent — prevents double-submit
    submitBtn.disabled    = true;
    submitBtn.textContent = "Sending…";

    // Send the email using credentials from config.js (never hardcoded here)
    emailjs.send(
        window.EMAILJS_CONFIG.serviceId,
        window.EMAILJS_CONFIG.bookingTemplate,
        {
            customer_name:  name,
            customer_email: email,
            phone:          phone,
            services:       services,
            total:          total
        }
    )

    // SUCCESS — email was actually delivered by EmailJS
    .then(function () {
        // Update the nav greeting
        userNameEl.textContent = name;

        // Show a personalised green success banner
        successMsg.textContent =
            "Booking confirmed! A confirmation email has been sent to " + email + ".";
        successMsg.style.display = "block";

        // Clear the form and cart only on confirmed success
        bookingForm.reset();
        clearFieldError("name",  "nameError");
        clearFieldError("email", "emailError");
        clearFieldError("phone", "phoneError");
        cart = [];
        localStorage.removeItem("laundryCart");
        renderCart();
    })

    // ERROR — something went wrong (wrong key, network issue, quota exceeded, etc.)
    .catch(function (err) {
        // Show a distinct amber/red error banner — NOT the green success one
        // The cart is NOT cleared so the user can fix the problem and try again.
        errorMsg.textContent =
            "Your booking details were received, but the confirmation email could not be sent. " +
            "Please screenshot this page or note your details — we will follow up manually.";
        errorMsg.style.display = "block";

        // Log the raw EmailJS error to the console for debugging
        console.error("EmailJS error:", err);
    })

    // Always re-enable the button when the request finishes (success or failure)
    .finally(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = "Book Now";
    });

});


/* ============================================================
   NEWSLETTER FORM SUBMISSION
   ============================================================ */
newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset feedback from last attempt
    newsletterFeedback.className   = "newsletter-feedback";
    newsletterFeedback.textContent = "";
    newsletterFeedback.style.display = "none";

    let name  = document.getElementById("newsletterName").value.trim();
    let email = document.getElementById("newsletterEmail").value.trim();

    // Basic validation — keep it simple for the newsletter
    if (name === "" || email === "") {
        newsletterFeedback.textContent   = "Please fill in both fields.";
        newsletterFeedback.classList.add("feedback-error");
        newsletterFeedback.style.display = "block";
        return;
    }

    if (!email.includes("@") || email.indexOf(".") < email.indexOf("@")) {
        newsletterFeedback.textContent   = "Please enter a valid email address.";
        newsletterFeedback.classList.add("feedback-error");
        newsletterFeedback.style.display = "block";
        return;
    }

    emailjs.send(
        window.EMAILJS_CONFIG.serviceId,
        window.EMAILJS_CONFIG.newsletterTemplate,
        {
            customer_name:  name,
            customer_email: email
        }
    )

    // SUCCESS — subscription email sent
    .then(function () {
        newsletterFeedback.textContent   = "You're subscribed! Check your inbox for a welcome email.";
        newsletterFeedback.classList.add("feedback-success");
        newsletterFeedback.style.display = "block";
        newsletterForm.reset();
    })

    // ERROR — subscription logged but email failed
    .catch(function (err) {
        // Clearly different from success — different text and different colour via CSS
        newsletterFeedback.textContent =
            "Subscription saved, but the welcome email could not be sent right now.";
        newsletterFeedback.classList.add("feedback-error");
        newsletterFeedback.style.display = "block";
        console.error("EmailJS newsletter error:", err);
    });

});


/* ============================================================
   EXPOSE CART FUNCTIONS TO GLOBAL SCOPE
   The onclick handlers in the HTML are string attributes so they
   need these functions to be on window, not just in module scope.
   ============================================================ */
window.addService    = addService;
window.removeService = removeService;