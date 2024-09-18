// Function to add an item to the cart
function addToCart(button) {
    const productElement = button.parentElement;
    const name = productElement.getAttribute('data-name');
    const price = parseFloat(productElement.getAttribute('data-price'));
    const image = productElement.getAttribute('data-image');

    let size = "УНИВЕРЗАЛНА"; // Default size for products without size selection

    // Check if the product has a size selector
    const sizeSelector = productElement.querySelector('.product-size');
    if (sizeSelector) {
        size = sizeSelector.value; // Get selected size if available
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the item is already in the cart with the same size
    const existingItemIndex = cart.findIndex(item => item.name === name && item.size === size);
    
    if (existingItemIndex > -1) {
        // If item exists with the same size, increase the quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // If item doesn't exist, add it to the cart
        cart.push({ name, price, quantity: 1, image, size });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}



// Function to update the cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
}

// Function to update the cart page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');

    function updateCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
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
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <h2>${item.name}</h2>
                        <p>Price: ${item.price.toFixed(2)} МКД</p>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <p>Total: ${(itemTotal).toFixed(2)} МКД</p>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            cartSummaryContainer.innerHTML = `<h2 class="total-price">Total Price: ${total.toFixed(2)} МКД</h2>`;
        }
    }

    window.removeFromCart = function(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); // Remove item at index
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    };

    updateCart();
});
