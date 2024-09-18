document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    const clearCartButton = document.getElementById('clear-cart-btn');

    function updateCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Твојата кошничка е празна.</p>';
            cartSummaryContainer.innerHTML = '';
            clearCartButton.style.display = 'none'; // Hide the button if cart is empty
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
                        <h2>${item.name} (Големина: ${item.size})</h2>
                        <p>Цена: ${item.price.toFixed()} мкд</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                        <p>Вкупно: ${itemTotal.toFixed()} мкд</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Избриши</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            cartSummaryContainer.innerHTML = `
                <h2 class="total-price">Вкупно за плаќање: ${total.toFixed()} денари</h2>
            `;
            clearCartButton.style.display = 'block'; // Show the button if cart has items
        }
    }

    window.removeFromCart = function(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); // Remove item at index
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    };

    window.updateQuantity = function(index, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let item = cart[index];
        item.quantity = Math.max(1, item.quantity + change); // Ensure quantity is at least 1
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    };

    window.proceedToCheckout = function() {
        // Clear the cart
        localStorage.removeItem('cart');
        
        // Update the cart display
        updateCart();
        
        // Optionally redirect to a confirmation or checkout page
        alert("Ти благодарам за нарачката, сега твојата кошничка е празна.");
    };

    clearCartButton.addEventListener('click', () => {
        // Clear the cart
        localStorage.removeItem('cart');
        
        // Update the cart display
        updateCart();
    });

    updateCart();
});

const form = document.getElementById('checkout-form');
const fullName = document.getElementById("name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const city = document.getElementById("city");

function validatePhoneNumber(number) {
    // This regular expression checks for a 9-digit number
    const phonePattern = /^\d{9}$/;
    return phonePattern.test(number);
}

function sendEmail() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartDetails = cart.length > 0 ? '' : 'Твојата кошничка е празна.<br>';

    cart.forEach((item, index) => {
        cartDetails += `
            <div>
                <h2>${item.name}</h2> <!-- Include size -->
                <p>Цена: ${item.price.toFixed()} мкд</p>
                <p>Броја: ${item.quantity}</p>
                Величина: ${item.size}
                <p>Вкупно: ${(item.price * item.quantity).toFixed()} мкд</p>
                <br>
            </div>
        `;
    });

    const bodyMessage = `
        Име и презиме: ${fullName.value}<br>
        Телефонски број: ${phone.value}<br>
        Email: ${email.value}<br>
        Град: ${city.value}<br>
        <br>
        <h3>Детали за нарачка:</h3>
        ${cartDetails}
    `;

    // Validate phone number before sending
    if (!validatePhoneNumber(phone.value)) {
        Swal.fire({
            title: "Грешка",
            text: "Телефонскиот број мора да содржи точно 9 цифри.",
            icon: "error"
        });
        return;
    }

    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "osogovoporacki@gmail.com",
        Password: "2A38F0EF3FB0948E8191C7D14369F8E013C1",
        To: 'osogovoporacki@gmail.com',
        From: "osogovoporacki@gmail.com",
        Subject: `Нарачка од ${fullName.value}`,
        Body: bodyMessage
    }).then(
        message => {
            if (message === "OK") {
                Swal.fire({
                    title: "Ви благодариме",
                    text: "Успешно е направена порачката",
                    icon: "success"
                });

                form.reset();
                localStorage.removeItem('cart');
                updateCart();
            } else {
                Swal.fire({
                    title: "Грешка",
                    text: "Имаше проблем порачката е неуспешна. Обиди се повторно.",
                    icon: "error"
                });
            }
        }
    );
}


form.addEventListener("submit", function(e) {
    e.preventDefault();
    sendEmail();
});
