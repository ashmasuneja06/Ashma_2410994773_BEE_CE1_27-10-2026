const productList = [
    {
        id: 1,
        name: "Insulated Lunch Box",
        price: 699,
        category: "Kitchen",
        image: "https://rukminim2.flixcart.com/image/480/640/xif0q/lunch-box/7/k/r/1500-bpa-free-plastic-inner-stainless-steel-4-compartment-original-imahh2fsqcmqkhaq.jpeg?q=90"
    },
    {
        id: 2,
        name: "Magnetic Measuring Spoons",
        price: 249,
        category: "Kitchen",
        image: "https://homenkitchenshop.com/cdn/shop/files/91-3RRnZOHL.jpg?v=1758833861"
    },
    {
        id: 3,
        name: "Drawer Organizer",
        price: 399,
        category: "Home",
        image: "https://i5.walmartimages.com/seo/Gray-Expandable-Utensil-Drawer-Organizer-1-Pack-Adjustable-13-22-4-8-Compartment-Silverware-Organizer-Kitchen-Utensils-Spatulas-Cutlery-Tools-Easy-Cl_e75ed396-8458-4e8a-8c97-50ead632a3db.ad1509e87f3690e9b02e1b8a1c0beb5a.jpeg?odnBg=FFFFFF&odnHeight=580&odnWidth=580"
    },
    {
        id: 4,
        name: "Refillable Perfume Atomizer",
        price: 299,
        category: "Personal Care",
        image: "https://item-shopping.c.yimg.jp/i/n/mitistyle_sa-25120401337"
    },
    {
        id: 5,
        name: "Foldable Book Stand",
        price: 449,
        category: "Study",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500"
    },
    {
        id: 6,
        name: "Reusable Lint Roller",
        price: 199,
        category: "Home",
        image: "https://i.ebayimg.com/00/s/MTI2MVgxMjYz/z/2uAAAOSwax1m~DM0/$ _12.JPG?set_id=880000500F".replace("$ ", "$")
    },
    {
        id: 7,
        name: "Under-bed Storage Bag",
        price: 349,
        category: "Home",
        image: "https://dreamsleepaustralia.com.au/cdn/shop/files/Screenshot2024-11-30at11.45.35pm_1200x.png?v=1732971952"
    },
    {
        id: 8,
        name: "Adhesive Wall Hook Set",
        price: 149,
        category: "Home",
        image: "https://cdn.grofers.com/da/cms-assets/cms/product/45753b7b-ac2e-4ba0-8ba6-3c72afdeb95f.jpg"
    }
];

let cart = [];
let couponApplied = false;

function displayProducts() {
    const productsDiv = document.getElementById("products");
    const searchText = document.getElementById("search").value.toLowerCase();
    const selectedCategory = document.getElementById("category").value;
    const sortOrder = document.getElementById("sort").value;

    let filteredProducts = productList.filter(function (product) {
        const matchesSearch = product.name.toLowerCase().includes(searchText);
        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortOrder === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    productsDiv.innerHTML = "";

    if (filteredProducts.length === 0) {
        productsDiv.textContent = "No products found.";
        return;
    }

    filteredProducts.forEach(function (product) {
        productsDiv.innerHTML += `
            <div class="product-card">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-image"
                    onerror="this.style.display='none'"
                >
                <h3>${product.name}</h3>
                <p class="category-label">${product.category}</p>
                <p class="price">₹${product.price}</p>
                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

function addToCart(productId) {
    const product = productList.find(function (item) {
        return item.id === productId;
    });

    const cartItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

function changeQuantity(productId, amount) {
    const cartItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (cartItem) {
        cartItem.quantity += amount;

        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }

    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(function (item) {
        return item.id !== productId;
    });

    updateCart();
}

function applyCoupon() {
    const coupon = document.getElementById("coupon").value
        .trim()
        .toUpperCase();

    const message = document.getElementById("coupon-message");

    if (cart.length === 0) {
        message.textContent = "Add products before applying a coupon.";
        message.style.color = "red";
        return;
    }

    if (coupon === "SAVE10") {
        couponApplied = true;
        message.textContent = "Success! You saved 10%.";
        message.style.color = "green";
    } else {
        couponApplied = false;
        message.textContent = "Invalid coupon code.";
        message.style.color = "red";
    }

    updateCart();
}

function updateCart() {
    const cartDiv = document.getElementById("cart-items");
    cartDiv.innerHTML = "";

    let subtotal = 0;
    let totalQuantity = 0;

    cart.forEach(function (item) {
        const itemTotal = item.price * item.quantity;

        subtotal += itemTotal;
        totalQuantity += item.quantity;

        cartDiv.innerHTML += `
            <div class="cart-item">
                <strong>${item.name}</strong>
                <p>₹${item.price} × ${item.quantity} = ₹${itemTotal}</p>

                <div class="quantity-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn"
                        onclick="removeFromCart(${item.id})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    });

    if (cart.length === 0) {
        cartDiv.textContent = "Your cart is empty.";
        couponApplied = false;
        document.getElementById("coupon-message").textContent = "";
    }

    const discount = couponApplied ? subtotal * 0.10 : 0;
    const total = subtotal - discount;

    document.getElementById("cart-count").textContent = totalQuantity;
    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("discount").textContent = discount.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add a product first.");
        return;
    }

    document.getElementById("checkout-box").style.display = "block";
}

function closeCheckout() {
    document.getElementById("checkout-box").style.display = "none";
}

document.getElementById("checkout-form").addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const customerName =
            document.getElementById("customer-name").value.trim();

        const orderTotal =
            document.getElementById("total").textContent;

        alert(
            "Thank you, " + customerName +
            "! Your DailyDeals order has been placed.\n" +
            "Order Total: ₹" + orderTotal
        );

        cart = [];
        couponApplied = false;

        document.getElementById("coupon").value = "";
        document.getElementById("coupon-message").textContent = "";
        document.getElementById("checkout-form").reset();

        closeCheckout();
        updateCart();
    }
);

document.getElementById("search").addEventListener("input", displayProducts);
document.getElementById("category").addEventListener("change", displayProducts);
document.getElementById("sort").addEventListener("change", displayProducts);
document.getElementById("apply-coupon").addEventListener("click", applyCoupon);
document.getElementById("checkout-button").addEventListener("click", checkout);
document.getElementById("cancel-checkout").addEventListener("click", closeCheckout);

displayProducts();
updateCart();