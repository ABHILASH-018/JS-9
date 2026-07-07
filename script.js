// Credentials come from config.js (gitignored), not hardcoded here
emailjs.init(window.EMAILJS_CONFIG.publicKey);

// DOM refs grabbed once at the top
const cartList           = document.getElementById("selectedItems");
const totalDisplay       = document.getElementById("totalPrice");
const bookingForm        = document.getElementById("bookingForm");
const newsletterForm     = document.getElementById("newsletterForm");
const successMsg         = document.getElementById("successMessage");
const errorMsg           = document.getElementById("errorMessage");
const userNameEl         = document.getElementById("userName");
const submitBtn          = document.getElementById("submitBtn");
const newsletterFeedback = document.getElementById("newsletterFeedback");

// Cart — restore whatever the user had before a refresh
let cart = [];
if (localStorage.getItem("laundryCart")) {
    cart = JSON.parse(localStorage.getItem("laundryCart"));
    renderCart();
}

// --- Cart functions ---

function addService(name, price) {
    cart.push({ name, price });
    saveCart();
    renderCart();
}

function removeService(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem("laundryCart", JSON.stringify(cart));
}

function renderCart() {
    cartList.innerHTML = "";
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price;

        let item = document.createElement("li");
        item.innerHTML =
            cart[i].name + " — $" + cart[i].price +
            ' <button class="remove-btn" onclick="removeService(' + i + ')">Remove</button>';

        cartList.appendChild(item);
    }

    totalDisplay.textContent = total;
}

// --- Validation helpers ---

function showFieldError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("input-error");
    document.getElementById(errorId).textContent = message;
}

function clearFieldError(inputId, errorId) {
    document.getElementById(inputId).classList.remove("input-error");
    document.getElementById(errorId).textContent = "";
}

function validateBookingForm(name, email, phone) {
    let valid = true;

    if (name === "") {
        showFieldError("name", "nameError", "Please enter your full name.");
        valid = false;
    } else {
        clearFieldError("name", "nameError");
    }

    if (email === "") {
        showFieldError("email", "emailError", "Please enter your email address.");
        valid = false;
    } else if (!email.includes("@") || email.indexOf(".") < email.indexOf("@")) {
        showFieldError("email", "emailError", "That doesn't look like a valid email.");
        valid = false;
    } else {
        clearFieldError("email", "emailError");
    }

    // strip non-digits before checking length
    let digits = phone.replace(/\D/g, "");
    if (phone === "") {
        showFieldError("phone", "phoneError", "Please enter your phone number.");
        valid = false;
    } else if (digits.length < 10) {
        showFieldError("phone", "phoneError", "Phone number must have at least 10 digits.");
        valid = false;
    } else {
        clearFieldError("phone", "phoneError");
    }

    return valid;
}

// --- Booking form ---

bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // hide any previous feedback
    successMsg.style.display = "none";
    successMsg.textContent   = "";
    errorMsg.style.display   = "none";
    errorMsg.textContent     = "";

    let name  = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();

    if (!validateBookingForm(name, email, phone)) return;

    if (cart.length === 0) {
        errorMsg.textContent   = "Please add at least one service before booking.";
        errorMsg.style.display = "block";
        return;
    }

    let total    = 0;
    let services = cart.map(function (item) {
        total += item.price;
        return item.name;
    }).join(", ");

    submitBtn.disabled    = true;
    submitBtn.textContent = "Sending…";

    emailjs.send(
        window.EMAILJS_CONFIG.serviceId,
        window.EMAILJS_CONFIG.bookingTemplate,
        { customer_name: name, customer_email: email, phone, services, total }
    )

    .then(function () {
        userNameEl.textContent = name;

        // green banner — email actually went through
        successMsg.textContent   = "Booking confirmed! A confirmation email has been sent to " + email + ".";
        successMsg.style.display = "block";

        bookingForm.reset();
        clearFieldError("name",  "nameError");
        clearFieldError("email", "emailError");
        clearFieldError("phone", "phoneError");
        cart = [];
        localStorage.removeItem("laundryCart");
        renderCart();
    })

    .catch(function (err) {
        // amber banner — email failed, so don't clear the cart (user can try again)
        errorMsg.textContent   =
            "Your booking was received, but the confirmation email could not be sent. " +
            "Please note your details — we'll follow up manually.";
        errorMsg.style.display = "block";
        console.error("EmailJS error:", err);
    })

    .finally(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = "Book Now";
    });
});

// --- Newsletter form ---

newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    newsletterFeedback.className     = "newsletter-feedback";
    newsletterFeedback.textContent   = "";
    newsletterFeedback.style.display = "none";

    let name  = document.getElementById("newsletterName").value.trim();
    let email = document.getElementById("newsletterEmail").value.trim();

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
        { customer_name: name, customer_email: email }
    )

    .then(function () {
        newsletterFeedback.textContent   = "You're subscribed! Check your inbox for a welcome email.";
        newsletterFeedback.classList.add("feedback-success");
        newsletterFeedback.style.display = "block";
        newsletterForm.reset();
    })

    .catch(function (err) {
        newsletterFeedback.textContent   = "Subscription saved, but the welcome email couldn't be sent right now.";
        newsletterFeedback.classList.add("feedback-error");
        newsletterFeedback.style.display = "block";
        console.error("EmailJS newsletter error:", err);
    });
});

// needed because the onclick attributes in HTML look these up on window
window.addService    = addService;
window.removeService = removeService;