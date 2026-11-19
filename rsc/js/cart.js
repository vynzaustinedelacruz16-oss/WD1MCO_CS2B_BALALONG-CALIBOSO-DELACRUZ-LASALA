document.addEventListener("DOMContentLoaded", function () {

    // INITIALIZE CART
    let cart = [];

    try {
        const savedCart = JSON.parse(localStorage.getItem("islandCart") || "[]");
        cart = Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
        cart = [];
    }

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");
    const cartToast = document.getElementById("cartToast");
    let cartToastTimeout;

    function showCartToast(productName) {
    if (!cartToast) return;

    cartToast.textContent = `${productName} added to your cart.`;
    cartToast.classList.add("is-visible");

    window.clearTimeout(cartToastTimeout);

    cartToastTimeout = window.setTimeout(function () {
        cartToast.classList.remove("is-visible");
    }, 1800);
}

    // FORMAT PRICE
    const formatPrice = amount => {
        return "₱" + amount.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // ESCAPE HTML CONTENT
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    // SAVE CART
    function saveCart() {
        localStorage.setItem("islandCart", JSON.stringify(cart));
    }

    // UPDATE CART DISPLAY
    function updateCart() {

        let total = 0;
        let quantity = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            quantity += item.quantity;
        });

        if (cartItems) {

            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <p class="text-center text-secondary">
                        Your cart is empty.
                    </p>
                `;
            } else {

                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">

                        <img src="${escapeHTML(item.image)}"
                             alt="${escapeHTML(item.name)}"
                             onerror="this.style.display='none'">

                        <div class="cart-item-info">

                            <h6>${escapeHTML(item.name)}</h6>

                            <p>${formatPrice(item.price)}</p>

                            <div class="d-flex align-items-center gap-2 mt-2">

                                <button type="button"
                                    class="btn btn-sm btn-outline-secondary"
                                    data-cart-action="quantity"
                                    data-id="${item.id}"
                                    data-amount="-1">
                                    -
                                </button>

                                <span>${item.quantity}</span>

                                <button type="button"
                                    class="btn btn-sm btn-outline-secondary"
                                    data-cart-action="quantity"
                                    data-id="${item.id}"
                                    data-amount="1">
                                    +
                                </button>

                            </div>
                        </div>

                        <button type="button"
                            class="remove-cart"
                            data-cart-action="remove"
                            data-id="${item.id}"
                            aria-label="Remove ${escapeHTML(item.name)}">

                            <i class="bi bi-trash"></i>

                        </button>

                    </div>
                `).join("");
            }
        }

        if (cartTotal) {
            cartTotal.textContent = formatPrice(total);
        }

        if (cartCount) {
            cartCount.textContent = quantity;
        }

        saveCart();
    }

    // ADD TO CART
    document.querySelectorAll(".add-cart").forEach(function (button) {

        button.addEventListener("click", function () {

            const id = Number(this.dataset.id);
            const name = this.dataset.name;
            const price = Number(this.dataset.price);

            // Match the data-img attribute in products.html
            const image = this.dataset.img || "";

            if (!Number.isInteger(id) || id <= 0 ||
                !name || !Number.isFinite(price) || price <= 0) {
                return;
            }

            const existing = cart.find(item => item.id === id);

            if (existing) {
                existing.quantity++;
            } else {
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }

            updateCart();
            showCartToast(name);

            const originalHTML = this.innerHTML;

            this.innerHTML = '<i class="bi bi-check-lg"></i>';
            this.disabled = true;

            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.disabled = false;
            }, 800);

        });

    });

    // CART ITEM BUTTONS
    if (cartItems) {

        cartItems.addEventListener("click", function (event) {

            const button = event.target.closest("[data-cart-action]");

            if (!button) return;

            const id = Number(button.dataset.id);

            if (button.dataset.cartAction === "remove") {

                cart = cart.filter(item => item.id !== id);

            } else if (button.dataset.cartAction === "quantity") {

                const item = cart.find(item => item.id === id);
                const amount = Number(button.dataset.amount);

                if (!item || !Number.isFinite(amount)) return;

                item.quantity += amount;

                if (item.quantity <= 0) {
                    cart = cart.filter(item => item.id !== id);
                }
            }

            updateCart();

        });

    }

    // CLEAR CART
    const clearButton = document.getElementById("clear-cart");

    if (clearButton) {

        clearButton.addEventListener("click", function () {

            if (cart.length === 0) return;

            if (confirm("Are you sure you want to clear your cart?")) {
                cart = [];
                updateCart();
            }

        });

    }

    // CHECKOUT
    const checkoutButton = document.getElementById("checkout-btn");

    if (checkoutButton) {

        checkoutButton.addEventListener("click", function () {

            if (cart.length === 0) {
                alert("Your shopping cart is empty!");
                return;
            }

            const total = cart.reduce(
                (sum, item) => sum + (item.price * item.quantity), 0
            );

            const totalProducts = cart.reduce(
                (sum, item) => sum + item.quantity, 0
            );

            const message =
                "Thank you for shopping!\n\n" +
                "Number of products: " + totalProducts +
                "\nTotal Amount: " + formatPrice(total) +
                "\n\nThis is a demonstration checkout. " +
                "No real payment will be processed.";

            alert(message);

            cart = [];
            updateCart();

            const cartPanel = document.getElementById("cartPanel");

            if (cartPanel && window.bootstrap?.Offcanvas) {
                bootstrap.Offcanvas
                    .getOrCreateInstance(cartPanel)
                    .hide();
            }

        });

    }

    // INITIALIZE CART DISPLAY
    updateCart();

});