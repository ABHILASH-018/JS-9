const cart = [];
const cartList = document.getElementById("selectedItems");
const totalElement = document.getElementById("totalPrice");
const bookingForm = document.getElementById("bookingForm");
const successMessage = document.getElementById("successMessage");
const newsletterForm = document.getElementById("newsletterForm");

const STORAGE_KEY = "laundryCart";

// Restore cart if it exists
const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (savedCart && savedCart.length) {
    cart.push(...savedCart);
    renderCart();
}

function addService(name, price) {
    cart.push({
        name,
        price
    });

    updateStorage();
    renderCart();
}

function removeService(index) {
    cart.splice(index, 1);

    updateStorage();
    renderCart();
}

function updateStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function renderCart() {
    cartList.innerHTML = "";

    let total = 0;

    cart.forEach((service, index) => {

        total += service.price;

        const item = document.createElement("li");

        item.innerHTML = `
            <span>${service.name} - $${service.price}</span>
            <button class="remove-btn" onclick="removeService(${index})">
                Remove
            </button>
        `;

        cartList.appendChild(item);
    });

    totalElement.textContent = total;
}

function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

bookingForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !email || !phone) {
        alert("Please complete all fields.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (phone.length < 10) {
        alert("Please enter a valid phone number.");
        return;
    }

    if (cart.length === 0) {
        alert("Please add at least one laundry service.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const templateParams = {
        customer_name: name,
        customer_email: email,
        phone: phone,
        services: cart.map(item => item.name).join(", "),
        total: total
    };

    emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams
    )
    .then(() => {

        successMessage.style.display = "block";

        bookingForm.reset();

        cart.length = 0;

        localStorage.removeItem(STORAGE_KEY);

        renderCart();

    })
    .catch(() => {
        alert("Booking completed, but the confirmation email could not be sent.");
    });

});

newsletterForm.addEventListener("submit", function (event) {

    event.preventDefault();

    alert("Thank you for subscribing!");

    newsletterForm.reset();

});

// Make functions available for inline buttons
window.addService = addService;
window.removeService = removeService;