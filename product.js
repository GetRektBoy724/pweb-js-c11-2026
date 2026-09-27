// ========================================
// PRODUCT CATALOG - ORANG 2
// ========================================

// API
const PRODUCT_API = "https://dummyjson.com/products?limit=0";

// Data produk dari API
let products = [];

// Data produk yang sedang ditampilkan
let displayedProducts = [];

// Jumlah produk yang sedang ditampilkan
let visibleProductCount = 12;

// Jumlah produk yang ditambahkan setiap klik
const PRODUCTS_PER_LOAD = 12;

// Variabel untuk menyimpan ID produk yang dipilih
let selectedProductId = null;

// ========================================
// ELEMENT HTML
// ========================================

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");

const loadMoreButton = document.getElementById("loadMoreButton");

const productModal = document.getElementById("productModal");
const modalImage = document.querySelector(".modal-image");
const modalProductName = document.getElementById("modalProductName");
const modalProductBrand = document.getElementById("modalProductBrand");
const modalRating = document.getElementById("modalRating");
const modalPrice = document.getElementById("modalPrice");
const modalStock = document.getElementById("modalStock");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalAddCart = document.getElementById("modalAddCart");

// ========================================
// FETCH PRODUCTS
// ========================================

async function fetchProducts() {
    try {
        const response = await fetch(PRODUCT_API);

        if (!response.ok) {
            throw new Error("Gagal mengambil data produk.");
        }

        const data = await response.json();

        products = data.products;

        displayedProducts = [...products];

        visibleProductCount =
            PRODUCTS_PER_LOAD;

        renderProducts(displayedProducts);
        createCategoryOptions(products);

    } catch (error) {
        console.error("Error:", error);

        productGrid.innerHTML = `
            <div class="error-message">
                <h3>Gagal memuat produk</h3>
                <p>${error.message}</p>
                <button onclick="fetchProducts()">
                    Coba Lagi
                </button>
            </div>
        `;
    }
}


// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts(productList) {

    productGrid.innerHTML = "";

    if (productList.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-message">
                <h3>Produk tidak ditemukan</h3>
                <p>Coba gunakan kata kunci atau kategori lain.</p>
            </div>
        `;

        updateResultCount(0, 0);
        updateLoadMoreButton(0);
        return;
    }

    const productsToShow = productList.slice(0, visibleProductCount);

    productsToShow.forEach(product => {

        const originalPrice =
            product.price / (1 - product.discountPercentage / 100);

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        // ID ini juga berguna untuk bagian Cart & Product Detail
        // milik Orang 3
        productCard.dataset.productId = product.id;

        productCard.innerHTML = `
            <div class="product-image">

                <span class="discount">
                    -${Math.round(product.discountPercentage)}%
                </span>

                <span class="heart">
                    ♡
                </span>

                <img
                    src="${product.thumbnail}"
                    alt="${product.title}"
                >

            </div>

            <div class="product-info">

                <h3>
                    ${product.title}
                </h3>

                <div class="rating">
                    ★ ${product.rating}
                    <span>(${product.reviews ? product.reviews.length : 0} ulasan)</span>
                </div>

                <strong>
                    $${formatPrice(product.price)}
                </strong>

                <del>
                    $${formatPrice(originalPrice)}
                </del>

                <div class="product-meta">
                    ${Math.round(product.discountPercentage)}% OFF
                    • ${product.category}
                </div>

                <button
                    class="add-cart-btn"
                    data-product-id="${product.id}"
                    type="button"
                >
                    + Keranjang
                </button>

            </div>
        `;

        productGrid.appendChild(productCard);
    });

    updateResultCount(
        productsToShow.length,
        productList.length
    );

    updateLoadMoreButton(
        productList.length
    );
}


// ========================================
// FORMAT HARGA
// ========================================

function formatPrice(price) {
    return Math.round(price).toLocaleString("en-US");
}


// ========================================
// CATEGORY FILTER
// ========================================

function createCategoryOptions(productList) {

    const categories = [];

    productList.forEach(product => {

        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }

    });

    categories.sort();

    categoryFilter.innerHTML = `
        <option value="all">
            Semua Kategori
        </option>
    `;

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}


// ========================================
// FILTER + SEARCH
// ========================================

function filterProducts() {
    visibleProductCount =
        PRODUCTS_PER_LOAD;

    const searchKeyword =
        searchInput.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value;

    displayedProducts = products.filter(product => {

        const matchesSearch =
            product.title
                .toLowerCase()
                .includes(searchKeyword)

            ||

            product.category
                .toLowerCase()
                .includes(searchKeyword);

        const matchesCategory =
            selectedCategory === "all"
            ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    sortProducts();
}


// ========================================
// SORTING
// ========================================

function sortProducts() {
    visibleProductCount =
        PRODUCTS_PER_LOAD;

    const sortValue = sortSelect.value;

    if (sortValue === "price-low") {

        displayedProducts.sort((a, b) => {
            return a.price - b.price;
        });

    }

    else if (sortValue === "price-high") {

        displayedProducts.sort((a, b) => {
            return b.price - a.price;
        });

    }

    else if (sortValue === "rating-high") {

        displayedProducts.sort((a, b) => {
            return b.rating - a.rating;
        });

    }

    else if (sortValue === "rating-low") {

        displayedProducts.sort((a, b) => {
            return a.rating - b.rating;
        });

    }

    renderProducts(displayedProducts);
}


// ========================================
// DEBOUNCE + CLOSURE
// ========================================

function createDebounce(callback, delay) {

    let timeoutId;

    return function () {

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            callback();
        }, delay);
    };
}


// Membuat fungsi debounce
const handleSearch = createDebounce(
    filterProducts,
    300
);


// ========================================
// EVENT LISTENER
// ========================================

// Search
searchInput.addEventListener(
    "input",
    handleSearch
);


// Filter kategori
categoryFilter.addEventListener(
    "change",
    filterProducts
);


// Sorting
sortSelect.addEventListener(
    "change",
    sortProducts
);

// Load More
loadMoreButton.addEventListener(
    "click",
    function () {
        visibleProductCount += PRODUCTS_PER_LOAD;

        renderProducts(displayedProducts);
    }
);

// ========================================
// RESULT COUNT
// ========================================

function updateResultCount(
    visibleCount,
    totalCount
) {
    if (!resultCount) {
        return;
    }

    resultCount.textContent = `Menampilkan ${visibleCount} dari ${totalCount} produk`;
}


// ========================================
// JALANKAN PROGRAM
// ========================================

fetchProducts();

// ========================================
// CART & PRODUCT INTERACTION - ORANG 3
// ========================================
const CART_KEY = "cart";

let cart = [];

const cartButton = document.getElementById("cartButton");
const cartBadge = document.getElementById("cartBadge");
const cartDrawer = document.getElementById("cartDrawer");
const closeCartButton = document.getElementById("closeCartButton");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartBackdrop = document.getElementById("cartBackdrop");

function loadCart() {
    const savedCart = localStorage.getItem(CART_KEY);

    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    if (cart.length === 0) {
        localStorage.removeItem(CART_KEY);
        return;
    }

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
}

function addToCart(productId) {
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    const existingItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1
        });
    }

    saveCart();
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const totalQuantity = cart.reduce(function (total, item) {
        return total + item.quantity;
    }, 0);

    cartBadge.textContent = totalQuantity;
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <h3>Keranjang masih kosong</h3>
                <p>Tambahkan produk favoritmu.</p>
            </div>
        `;

        cartTotal.textContent = "$0";
        return;
    }

    cartItems.innerHTML = "";

    cart.forEach(function (item, index) {
        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img
                src="${item.thumbnail}"
                alt="${item.title}"
            >

            <div class="cart-item-info">
                <h3>${item.title}</h3>

                <strong>
                    $${formatPrice(item.price)}
                </strong>

                <div class="quantity-control">
                    <button
                        type="button"
                        class="quantity-btn"
                        data-action="decrease"
                        data-cart-index="${index}"
                    >
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        class="quantity-btn"
                        data-action="increase"
                        data-cart-index="${index}"
                    >
                        +
                    </button>
                </div>

                <button
                    type="button"
                    class="remove-cart"
                    data-cart-index="${index}"
                >
                    Hapus
                </button>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    updateCartTotal();
}

function updateQuantity(index, change) {
    const item = cart[index];

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartBadge();
    renderCart();
}

function updateCartTotal() {
    const total = cart.reduce(function (sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);

    cartTotal.textContent =
        "$" + formatPrice(total);
}

cartItems.addEventListener("click", function (event) {
    const quantityButton =
        event.target.closest(".quantity-btn");

    if (quantityButton) {
        const index =
            Number(quantityButton.dataset.cartIndex);

        const action =
            quantityButton.dataset.action;

        if (action === "increase") {
            updateQuantity(index, 1);
        }

        if (action === "decrease") {
            updateQuantity(index, -1);
        }

        return;
    }

    const removeButton =
        event.target.closest(".remove-cart");

    if (removeButton) {
        const index =
            Number(removeButton.dataset.cartIndex);

        cart.splice(index, 1);

        saveCart();
        updateCartBadge();
        renderCart();
    }
});

// ========================================
// PRODUCT CARD + MODAL EVENT DELEGATION
// ========================================
productGrid.addEventListener("click", function (event) {

    const addButton =
        event.target.closest(".add-cart-btn");

    if (addButton) {
        const productId =
            Number(addButton.dataset.productId);

        addToCart(productId);

        return;
    }

    const productCard =
        event.target.closest(".product-card");

    if (!productCard) {
        return;
    }

    const productId =
        Number(productCard.dataset.productId);

    openProductModal(productId);
});

function openCart() {
    cartDrawer.classList.add("is-open");
    cartBackdrop.hidden = false;
}

function closeCart() {
    cartDrawer.classList.remove("is-open");
    cartBackdrop.hidden = true;
}

cartButton.addEventListener("click", openCart);

closeCartButton.addEventListener(
    "click",
    closeCart
);

cartBackdrop.addEventListener(
    "click",
    closeCart
);

loadCart();
updateCartBadge();
renderCart();

// ========================================
// LOAD MORE
// ========================================
function updateLoadMoreButton(totalCount) {
    if (visibleProductCount >= totalCount) {
        loadMoreButton.style.display = "none";
    } else {
        loadMoreButton.style.display = "inline-block";
    }
}

function openProductModal(productId) {
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    selectedProductId = product.id;

    modalImage.innerHTML = `
        <img
            src="${product.thumbnail}"
            alt="${product.title}"
        >
    `;

    modalProductName.textContent =
        product.title;

    modalProductBrand.textContent =
        product.brand || "Brand tidak tersedia";

    modalRating.textContent =
        product.rating;

    modalPrice.textContent =
        "$" + formatPrice(product.price);

    modalStock.textContent =
        product.stock;

    modalCategory.textContent =
        product.category;

    modalDescription.textContent =
        product.description;

    productModal.classList.add("is-open");

    productModal.setAttribute(
        "aria-hidden",
        "false"
    );
}

function closeProductModal() {
    productModal.classList.remove("is-open");

    productModal.setAttribute(
        "aria-hidden",
        "true"
    );

    selectedProductId = null;
}

productModal.addEventListener(
    "click",
    function (event) {

        const closeButton =
            event.target.closest("[data-close-modal]");

        if (!closeButton) {
            return;
        }

        closeProductModal();
    }
);

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {
            closeProductModal();
        }

    }
);

modalAddCart.addEventListener(
    "click",
    function () {

        if (selectedProductId === null) {
            return;
        }

        addToCart(selectedProductId);

        closeProductModal();
    }
);