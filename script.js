let cart = [];

const list = document.getElementById("selectedItems");
const totalPrice = document.getElementById("totalPrice");
const bookingForm = document.getElementById("bookingForm");
const newsletterForm = document.getElementById("newsletterForm");
const successMessage = document.getElementById("successMessage");
const userName = document.getElementById("userName");

// Load saved cart
if (localStorage.getItem("laundryCart")) {
    cart = JSON.parse(localStorage.getItem("laundryCart"));
    showCart();
}

// Add service
function addService(name, price) {

    cart.push({
        name: name,
        price: price
    });

    localStorage.setItem("laundryCart", JSON.stringify(cart));

    showCart();
}

// Remove service
function removeService(index) {

    cart.splice(index, 1);

    localStorage.setItem("laundryCart", JSON.stringify(cart));

    showCart();
}

// Display selected services
function showCart() {

    list.innerHTML = "";

    let total = 0;

    for (let i = 0; i < cart.length; i++) {

        total += cart[i].price;

        let item = document.createElement("li");

        item.innerHTML =
            cart[i].name +
            " - $" +
            cart[i].price +
            ' <button class="remove-btn" onclick="removeService(' +
            i +
            ')">Remove</button>';

        list.appendChild(item);
    }

    totalPrice.textContent = total;
}

// Booking form
bookingForm.addEventListener("submit", function (e) {

    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();

    if (name === "" || email === "" || phone === "") {
        alert("Please fill in all fields.");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Enter a valid email.");
        return;
    }

    if (phone.length < 10) {
        alert("Enter a valid phone number.");
        return;
    }

    if (cart.length === 0) {
        alert("Please add at least one service.");
        return;
    }

    // Show user name in navbar
    userName.textContent = name;

    let total = 0;
    let services = "";

    for (let i = 0; i < cart.length; i++) {

        total += cart[i].price;

        services += cart[i].name;

        if (i < cart.length - 1) {
            services += ", ";
        }
    }

    let templateParams = {
        customer_name: name,
        customer_email: email,
        phone: phone,
        services: services,
        total: total
    };

    emailjs.send(
    "service_ysccv5s",
    "template_gakhmo1",
    templateParams
)
    .then(function () {

    successMessage.style.display = "block";

    bookingForm.reset();

    cart = [];

    localStorage.removeItem("laundryCart");

    showCart();

})
.catch(function () {

    alert("Booking saved but email could not be sent.");

    successMessage.style.display = "block";

    bookingForm.reset();

    cart = [];

    localStorage.removeItem("laundryCart");

    showCart();

});

});

// Newsletter form
newsletterForm.addEventListener("submit", function (e) {

    e.preventDefault();

    let name = document.getElementById("newsletterName").value.trim();
    let email = document.getElementById("newsletterEmail").value.trim();

    if (name === "" || email === "") {
        alert("Please fill in all fields.");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Enter a valid email.");
        return;
    }

    let templateParams = {
        customer_name: name,
        customer_email: email
    };

    emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_NEWSLETTER_TEMPLATE",
        templateParams
    )

    .then(function () {

        alert("Thanks for subscribing!");

        newsletterForm.reset();

    })

    .catch(function () {

        alert("Subscription saved but email could not be sent.");

        newsletterForm.reset();

    });

});

window.addService = addService;
window.removeService = removeService;