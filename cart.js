document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    const clearCartButton = document.getElementById('clear-cart-btn');

    function updateCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Твојата кошничка е празна.</p>';
            cartSummaryContainer.innerHTML = '';
            clearCartButton.style.display = 'none';
        } else {
            let total = 0;
            cartItemsContainer.innerHTML = '';
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
            clearCartButton.style.display = 'block';
        }
    }

    window.removeFromCart = function(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    };

    window.updateQuantity = function(index, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let item = cart[index];
        item.quantity = Math.max(1, item.quantity + change);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    };

    window.proceedToCheckout = function() {
        localStorage.removeItem('cart');
        updateCart();
        alert("Ти благодарам за нарачката, сега твојата кошничка е празна.");
    };

    clearCartButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        updateCart();
    });

    updateCart();
});

// Form Elements
const form = document.getElementById('checkout-form');
const fullName = document.getElementById("name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const city = document.getElementById("city");

// Phone Number Validation
function validatePhoneNumber(number) {
    const cleanedNumber = number.replace(/\D/g, ''); // Remove non-numeric characters
    return /^\d{9}$/.test(cleanedNumber); // Check if exactly 9 digits
}

function sendEmail() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartDetails = cart.length > 0 ? '' : 'Твојата кошничка е празна.<br>';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartDetails += `
            <div>
                <h2>${item.name}</h2>
                <p>Цена: ${item.price.toFixed()} мкд</p>
                <p>Броја: ${item.quantity}</p>
                Величина: ${item.size}
                <p>Вкупно: ${itemTotal.toFixed()} мкд</p>
                <br>
            </div>
        `;
    });

    const bodyMessage = `
        Име и презиме: ${fullName.value}<br>
        Телефонски број: ${phone.value.trim()}<br>
        Email: ${email.value}<br>
        Град: ${city.value}<br>
        <br>
        <h3>Детали за нарачка:</h3>
        ${cartDetails}
        <br>
        <h2 class="total-price">Вкупно за плаќање: ${total.toFixed()} денари</h2>
    `;

    // Validate phone number before sending email
    if (!validatePhoneNumber(phone.value.trim())) {
        Swal.fire({
            title: "Грешка",
            text: "Телефонскиот број мора да содржи точно 9 цифри (без букви и празни места).",
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
                    text: "Имаше проблем, порачката не беше успешна. Обиди се повторно.",
                    icon: "error"
                });
            }
        }
    );
}

// Form Submit Event
form.addEventListener("submit", function(e) {
    e.preventDefault();
    sendEmail();
});
