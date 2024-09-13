document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');

    function updateCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Твојата кошничка е празна.</p>';
            cartSummaryContainer.innerHTML = '';
        } else {
            let total = 0;
            cartItemsContainer.innerHTML = ''; // Clear the container first
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div>
                        <h2>${item.name}</h2>
                        <p>Цена: ${item.price.toFixed()} мкд</p>
                        <p>Бројки на нарачани производи: ${item.quantity}</p>
                    </div>
                    <p>Вкупно: ${itemTotal.toFixed()} мкд</p> <br>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Избриши</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            cartSummaryContainer.innerHTML = `
                <h2 class="total-price">Вкупно за плаќање: ${total.toFixed()} денари</h2>
            `;
        }
    }

    window.removeFromCart = function(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); // Remove item at index
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    };

    window.proceedToCheckout = function() {
        // Clear the cart
        localStorage.removeItem('cart');
        
        // Update the cart display
        updateCart();
        
        // Optionally redirect to a confirmation or checkout page
        alert("Ти благодарам за нарачката, сега твојата кошнича е празна.");
    };

    updateCart();
});

// Select the form and form fields
const form = document.getElementById('checkout-form');
const fullName = document.getElementById("name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const city = document.getElementById("city");

function sendEmail() {
    // Fetch cart data
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartDetails = cart.length > 0 ? '' : 'Твојата кошничка е празна.<br>';

    cart.forEach((item, index) => {
        cartDetails += `
            <div>
                <h2>${item.name}</h2>
                <p>Цена: ${item.price.toFixed()} мкд</p>
                <p>Броја: ${item.quantity}</p>
                <p>Вкупно: ${(item.price * item.quantity).toFixed()} мкд</p>
                <br>
            </div>
        `;
    });

    // Create the email body message with cart details
    const bodyMessage = `
        Име и презиме: ${fullName.value}<br>
        Телефонски број: ${phone.value}<br>
        Email: ${email.value}<br>
        Град: ${city.value}<br>
        <br>
        <h3>Детали за нарачка:</h3>
        ${cartDetails}
    `;

    // Send email using SMTP.js
    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "osogovoporacki@gmail.com",
        Password: "2A38F0EF3FB0948E8191C7D14369F8E013C1",
        To: 'osogovoporacki@gmail.com',
        From: "osogovoporacki@gmail.com",
        Subject: `Нарачка од ${fullName.value}`,  // Subject with customer name
        Body: bodyMessage
    }).then(
        message => {
            if (message === "OK") {
                Swal.fire({
                    title: "Ви благодариме",
                    text: "Успешно е направена порачката",
                    icon: "success"
                });

                // Reset form and cart after successful submission
                form.reset();
                localStorage.removeItem('cart'); // Clear the cart after sending the order
                updateCart(); // Update cart display
            } else {
                // Handle errors
                Swal.fire({
                    title: "Грешка",
                    text: "Имаше проблем порачката е неуспешна. Обиди се повторно.",
                    icon: "error"
                });
            }
        }
    );
}

// Add event listener for form submission
form.addEventListener("submit", function(e) {
    e.preventDefault();  // Prevent the default form submission behavior
    sendEmail();  // Call the function to send the email
});
