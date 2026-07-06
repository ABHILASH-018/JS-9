let selectedServices = [];
let totalPrice = 0;

const selectedItems = document.getElementById("selectedItems");
const totalPriceElement = document.getElementById("totalPrice");
const bookingForm = document.getElementById("bookingForm");

function addItem(serviceName, price) {
    selectedServices.push({
        name: serviceName,
        price: price
    });

    totalPrice += price;

    updateBooking();
}

function removeItem(index) {
    totalPrice -= selectedServices[index].price;

    selectedServices.splice(index, 1);

    updateBooking();
}

function updateBooking() {
    selectedItems.innerHTML = "";

    selectedServices.forEach((service, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${service.name} - $${service.price}</span>
            <button class="remove-btn" onclick="removeItem(${index})">
                Remove
            </button>
        `;

        selectedItems.appendChild(li);

    });

    totalPriceElement.textContent = totalPrice;
}

bookingForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    if (name === "" || email === "") {
        alert("Please fill in all details.");
        return;
    }

    if (selectedServices.length === 0) {
        alert("Please select at least one laundry service.");
        return;
    }

    alert(
        "Booking Successful!\n\n" +
        "Customer : " + name +
        "\nEmail : " + email +
        "\nTotal Amount : $" + totalPrice
    );

    selectedServices = [];
    totalPrice = 0;

    updateBooking();

    bookingForm.reset();

});

const newsletterForm = document.querySelector(".newsletter form");

newsletterForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const inputs = newsletterForm.querySelectorAll("input");

    const userName = inputs[0].value.trim();
    const userEmail = inputs[1].value.trim();

    if (userName === "" || userEmail === "") {
        alert("Please enter your name and email.");
        return;
    }

    alert("Thank you for subscribing to our newsletter!");

    newsletterForm.reset();

});