// Data produk
const products = [
    {
        id: 1,
        name: "Kaos Premium 4 Trio",
        price: 125000,
        image: "https://picsum.photos/seed/kaos1/300/200"
    },
    {
        id: 2,
        name: "Kemeja Batik Modern",
        price: 250000,
        image: "https://picsum.photos/seed/kemeja1/300/200"
    },
    {
        id: 3,
        name: "Celana Jeans Slim Fit",
        price: 350000,
        image: "https://picsum.photos/seed/jeans1/300/200"
    },
    {
        id: 4,
        name: "Sepatu Sneakers Sport",
        price: 450000,
        image: "https://picsum.photos/seed/sepatu1/300/200"
    },
    {
        id: 5,
        name: "Tas Ransel Laptop",
        price: 300000,
        image: "https://picsum.photos/seed/tas1/300/200"
    },
    {
        id: 6,
        name: "Jam Tangan Analog",
        price: 550000,
        image: "https://picsum.photos/seed/jam1/300/200"
    },
    {
        id: 7,
        name: "Topi Baseball",
        price: 85000,
        image: "https://picsum.photos/seed/topi1/300/200"
    },
    {
        id: 8,
        name: "Sunglasses UV Protection",
        price: 175000,
        image: "https://picsum.photos/seed/kacamata1/300/200"
    }
];

// Inisialisasi keranjang dari localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fungsi untuk memformat harga
function formatPrice(price) {
    return 'Rp ' + price.toLocaleString('id-ID');
}

// Fungsi untuk menampilkan produk di halaman dashboard
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');
}

// Fungsi untuk menambah produk ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Produk berhasil ditambahkan ke keranjang!');
}

// Fungsi untuk menyimpan keranjang ke localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Fungsi untuk update jumlah item di keranjang
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Fungsi untuk menampilkan keranjang
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Keranjang Belanja Kosong</h3>
                <p>Belum ada produk yang dipilih</p>
                <a href="index.html" class="btn btn-primary">Belanja Sekarang</a>
            </div>
        `;
        updateCartSummary();
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-actions">
                <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

// Fungsi untuk update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            displayCart();
            updateCartCount();
        }
    }
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
    updateCartCount();
    showNotification('Produk dihapus dari keranjang');
}

// Fungsi untuk update ringkasan keranjang
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 15000 : 0;
    const total = subtotal + shipping;

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = formatPrice(shipping);
    if (totalEl) totalEl.textContent = formatPrice(total);
}

// Fungsi untuk mengosongkan keranjang
function clearCart() {
    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
        cart = [];
        saveCart();
        displayCart();
        updateCartCount();
        showNotification('Keranjang berhasil dikosongkan');
    }
}

// Fungsi checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Keranjang belanja masih kosong!', 'error');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 15000;
    
    if (confirm(`Total pembayaran: ${formatPrice(total)}\n\nLanjutkan ke pembayaran?`)) {
        // Simulasi proses checkout
        showNotification('Memproses pembayaran...', 'info');
        
        setTimeout(() => {
            cart = [];
            saveCart();
            displayCart();
            updateCartCount();
            showNotification('Pembayaran berhasil! Terima kasih telah berbelanja di 4 Trio.', 'success');
            
            // Redirect ke halaman utama setelah 2 detik
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 2000);
    }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Inisialisasi halaman
document.addEventListener('DOMContentLoaded', function() {
    // Cek halaman mana yang sedang aktif
    if (document.getElementById('productGrid')) {
        // Halaman dashboard
        displayProducts();
    } else if (document.getElementById('cartItems')) {
        // Halaman keranjang
        displayCart();
    }
    
    // Update cart count di semua halaman
    updateCartCount();
});

// Tambahkan style untuk notifikasi
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        transition: opacity 0.3s;
    }
    
    .notification-success {
        border-left: 4px solid var(--success-color);
        color: var(--success-color);
    }
    
    .notification-error {
        border-left: 4px solid var(--danger-color);
        color: var(--danger-color);
    }
    
    .notification-info {
        border-left: 4px solid var(--primary-color);
        color: var(--primary-color);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(notificationStyle);