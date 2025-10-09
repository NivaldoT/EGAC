
function addToCart(product) {
    const cartTable = document.querySelector(".cart-section .table-cart tbody");
    if (!cartTable) return;

    const name = product.getAttribute("data-name");
    const price = parseFloat(product.getAttribute("data-price"));
    const img = product.getAttribute("data-img");

    // Verifica se já existe o produto no carrinho
    let existingRow = Array.from(cartTable.rows).find(row => row.cells[2] && row.cells[2].innerText === name);
    if (existingRow) {
        // Atualiza quantidade e total
        let qtyCell = existingRow.cells[4].querySelector('.cart-qty');
        let totalCell = existingRow.cells[5];
        let qty = parseInt(qtyCell.innerText) + 1;
        qtyCell.innerText = qty;
        totalCell.innerText = "R$" + (qty * price).toFixed(2);
    } else {
        // Adiciona nova linha
        let row = cartTable.insertRow();
        row.innerHTML = `
            <td><button class="cart-remove btn btn-link" title="Remover" style="color:black;font-size:18px;">&times;</button>
            </td>
            <td>
                <img src="${img}" alt="" style="width:40px;height:40px;object-fit:cover;margin-left:5px;">
            </td>
            <td>${name}</td>
            <td>R$${price.toFixed(2)}</td>
            <td>
                <button class="cart-qty-minus btn btn-sm btn-light" style="margin-right:3px;">-</button>
                <span class="cart-qty">1</span>
                <button class="cart-qty-plus btn btn-sm btn-light" style="margin-left:3px;">+</button>
            </td>
            <td>R$${price.toFixed(2)}</td>
        `;
    }

    updateCartEvents();
    updateCartCount();
    updateCartTotal();
}

function updateCartEvents() {
    // Remover item
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.onclick = function () {
            const row = btn.closest('tr');
            if (row) row.remove();
            updateCartCount();
            updateCartTotal();
        };
    });

    // Diminuir quantidade
    document.querySelectorAll('.cart-qty-minus').forEach(btn => {
        btn.onclick = function () {
            const row = btn.closest('tr');
            const qtySpan = row.querySelector('.cart-qty');
            let qty = parseInt(qtySpan.innerText);
            if (qty > 1) {
                qty--;
                qtySpan.innerText = qty;
                const price = parseFloat(row.cells[3].innerText.replace("R$", "").replace(",", "."));
                row.cells[5].innerText = "R$" + (qty * price).toFixed(2);
            } else {
                row.remove();
            }
            updateCartCount();
            updateCartTotal();
        };
    });

    // Aumentar quantidade
    document.querySelectorAll('.cart-qty-plus').forEach(btn => {
        btn.onclick = function () {
            const row = btn.closest('tr');
            const qtySpan = row.querySelector('.cart-qty');
            let qty = parseInt(qtySpan.innerText);
            qty++;
            qtySpan.innerText = qty;
            const price = parseFloat(row.cells[3].innerText.replace("R$", "").replace(",", "."));
            row.cells[5].innerText = "R$" + (qty * price).toFixed(2);
            updateCartCount();
            updateCartTotal();
        };
    });
}

function updateCartCount() {
    const cartCount = document.querySelector('.btn-cart .icon-shopping_cart');
    if (cartCount) {
        const cartTableRows = document.querySelectorAll('.cart-section .table-cart tbody tr');
        let totalItems = 0;
        cartTableRows.forEach(row => {
            const qtySpan = row.querySelector('.cart-qty');
            if (qtySpan) {
                totalItems += parseInt(qtySpan.innerText) || 0;
            }
        });
        // Atualiza o número dentro do [ ]
        const countText = cartCount.nextSibling;
        if (countText && countText.nodeType === Node.TEXT_NODE) {
            countText.textContent = `[${totalItems}]`;
        }
    }
}

function updateCartTotal() {
    const cartTable = document.querySelector(".cart-section .table-cart tbody");
    let total = 0;
    Array.from(cartTable.rows).forEach(row => {
        let totalCell = row.cells[5];
        if (totalCell) {
            let value = parseFloat(totalCell.innerText.replace("R$", "").replace(",", "."));
            total += value;
        }
    });
    const totalDisplay = document.querySelector(".cart-section .cart-total h3");
    if (totalDisplay) {
        totalDisplay.innerText = "Total: R$" + total.toFixed(2);
    }
}

document.querySelectorAll('.buy-now').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const product = btn.closest('.product');
        if (product) addToCart(product);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".btn-filter");
    let products = document.querySelectorAll(".product");

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {
            buttons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            let filter = this.getAttribute("data-filter");

            products.forEach(prod => {
                let category = prod.getAttribute("data-category");
                let container = prod;
                if (prod.parentElement && (
                    prod.parentElement.classList.contains('col-md-6') ||
                    prod.parentElement.classList.contains('col-lg-3') ||
                    prod.parentElement.classList.contains('col-md-12')
                )) {
                    container = prod.parentElement;
                }
                if (filter === "todos" || (category && category.includes(filter))) {
                    container.style.display = "";
                } else {
                    container.style.display = "none";
                }
            });
        });
    });

    const btnCart = document.querySelector(".btn-cart");
    const cartSection = document.querySelector(".cart-section");
    const mainContent = document.querySelector("#main-content");
    const btnCartClose = document.querySelector(".btn-cart-close");

    if (btnCart && cartSection && mainContent) {
        btnCart.addEventListener("click", function (e) {
            e.preventDefault();
            const isActive = cartSection.classList.contains("cart-active");
            if (isActive) {
                cartSection.classList.remove("cart-active");
                cartSection.classList.add("cart-inactive");
                mainContent.classList.remove("main-content"); // Remove margin quando fecha
            } else {
                cartSection.classList.remove("cart-inactive");
                cartSection.classList.add("cart-active");
                mainContent.classList.add("main-content"); // Adiciona margin quando abre
            }
        });
    }

    if (btnCartClose && cartSection && mainContent) {
        btnCartClose.addEventListener("click", function () {
            cartSection.classList.remove("cart-active");
            cartSection.classList.add("cart-inactive");
            mainContent.classList.remove("main-content");
        });
    }
});

function finalizarCompra() {
    const cartTableRows = document.querySelectorAll('.cart-section .table-cart tbody tr');
    if (cartTableRows.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Redireciona para a página de carrinho completo
    window.location.href = '/cart';
}