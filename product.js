// ========================================
// PRODUCT CATALOG - ORANG 2
// ========================================

// API
const PRODUCT_API = "https://dummyjson.com/products";

// Data produk dari API
let products = [];

// Data produk yang sedang ditampilkan
let displayedProducts = [];


// ========================================
// ELEMENT HTML
// ========================================

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");


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

        updateResultCount(0);
        return;
    }

    productList.forEach(product => {

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
                    <span>(${product.stock})</span>
                </div>

                <strong>
                    Rp${formatPrice(product.price)}
                </strong>

                <del>
                    Rp${formatPrice(originalPrice)}
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

    updateResultCount(productList.length);
}


// ========================================
// FORMAT HARGA
// ========================================

function formatPrice(price) {
    return Math.round(price).toLocaleString("id-ID");
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


// ========================================
// RESULT COUNT
// ========================================

function updateResultCount(count) {

    if (!resultCount) {
        return;
    }

    resultCount.textContent =
        `${count} produk ditemukan`;
}


// ========================================
// JALANKAN PROGRAM
// ========================================

fetchProducts();