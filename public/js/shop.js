
function addToCart(product) {
    const id = product.getAttribute("data-id");
    const name = product.getAttribute("data-name");
    const price = parseFloat(product.getAttribute("data-price"));
    const img = product.getAttribute("data-img");

    // Salvar no localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingProduct = cart.find(item => item.id === id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, price, img, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Atualizar carrinho visual
    renderSidebarCart();
}

function renderSidebarCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items-sidebar');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Seu carrinho está vazio</p>';
        updateSidebarTotals();
        return;
    }
    
    container.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'display: flex; align-items: center; gap: 15px; padding: 15px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px;';
        itemDiv.setAttribute('data-index', index);
        itemDiv.setAttribute('data-price', item.price);
        
        itemDiv.innerHTML = `
            <button class="cart-remove-sidebar" style="background: none; border: none; color: #999; font-size: 24px; cursor: pointer; padding: 0; line-height: 1;" data-index="${index}">&times;</button>
            <img src="${item.img}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 4px;">
            <div style="flex: 1; min-width: 0;">
                <div style="font-size: 14px; color: #333; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</div>
                <div style="display: inline-flex; align-items: center; gap: 8px; border: 1px solid #ddd; border-radius: 4px; padding: 2px 8px; background: #fff;">
                    <button class="sidebar-qty-minus" data-index="${index}" style="background: none; border: none; color: #82ae46; font-size: 18px; cursor: pointer; padding: 0;">−</button>
                    <span class="sidebar-qty-value" style="min-width: 20px; text-align: center; font-size: 14px;">${item.quantity}</span>
                    <button class="sidebar-qty-plus" data-index="${index}" style="background: none; border: none; color: #82ae46; font-size: 18px; cursor: pointer; padding: 0;">+</button>
                </div>
            </div>
            <div style="font-size: 16px; font-weight: 500; color: #333; white-space: nowrap;">R$ ${Math.floor(item.price * item.quantity)},<sup style="font-size: 12px;">${String(((item.price * item.quantity) % 1).toFixed(2)).split('.')[1]}</sup></div>
        `;
        
        container.appendChild(itemDiv);
    });
    
    attachSidebarEventListeners();
    updateSidebarTotals();
}

function attachSidebarEventListeners() {
    // Remover item
    document.querySelectorAll('.cart-remove-sidebar').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderSidebarCart();
        });
    });
    
    // Diminuir quantidade
    document.querySelectorAll('.sidebar-qty-minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderSidebarCart();
            } else {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderSidebarCart();
            }
        });
    });
    
    // Aumentar quantidade
    document.querySelectorAll('.sidebar-qty-plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart[index].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderSidebarCart();
        });
    });
}

function updateSidebarTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    let itemCount = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        itemCount += item.quantity;
    });
    
    const totalParts = subtotal.toFixed(2).split('.');
    document.getElementById('sidebar-total').textContent = totalParts[0];
    document.getElementById('sidebar-total-cents').textContent = totalParts[1];
    
    // Atualizar contador no ícone do carrinho
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    
    const cartCount = document.querySelector('.btn-cart .icon-shopping_cart');
    if (cartCount) {
        const countText = cartCount.nextSibling;
        if (countText && countText.nodeType === Node.TEXT_NODE) {
            countText.textContent = `[${totalItems}]`;
        }
    }
}

function updateCartTotal() {
    // Função mantida para compatibilidade, mas não mais usada
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
                renderSidebarCart(); // Renderizar carrinho ao abrir
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
    
    // Carregar carrinho inicial
    renderSidebarCart();
});

function finalizarCompra() {
    // Verificar se usuário está logado
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    let userEmail = getCookie('UsuarioEmail');
    
    if (!userEmail) {
        // Usuário não está logado - mostrar mensagem no carrinho
        const errorDiv = document.getElementById('cart-error-message');
        const errorText = document.getElementById('cart-error-text');
        const errorImg = document.getElementById('cart-error-img');
        
        if (errorDiv && errorText && errorImg) {
            errorText.textContent = 'Você precisa estar logado para finalizar a compra.';
            errorDiv.style.display = 'block';
            errorImg.style.display = 'none';
            document.querySelector('.cart-body').scrollTop = 0;
        }
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        const errorDiv = document.getElementById('cart-error-message');
        const errorText = document.getElementById('cart-error-text');
        const errorImg = document.getElementById('cart-error-img');
        
        if (errorDiv && errorText && errorImg) {
            errorText.textContent = 'Seu carrinho está vazio!';
            errorDiv.style.display = 'block';
            errorImg.style.display = 'none';
            document.querySelector('.cart-body').scrollTop = 0;
        }
        return;
    }
    
    // Processar compra diretamente sem confirm
    // Preparar itens para envio
    const selectedItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        img: item.img
    }));
    
    // Enviar pedido para o servidor
        fetch('/pedido/gravar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(selectedItems)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Server error:', text);
                    throw new Error(`Erro ${response.status}: ${text.substring(0, 100)}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.ok) {
                // Mostrar mensagem de sucesso no carrinho
                const successDiv = document.getElementById('cart-success-message');
                const successText = document.getElementById('cart-success-text');
                
                if (successDiv && successText) {
                    successText.textContent = data.msg;
                    successDiv.style.display = 'block';
                    
                    // Scroll para o topo do carrinho
                    document.querySelector('.cart-body').scrollTop = 0;
                }
                
                // Limpar carrinho após 2 segundos
                setTimeout(function() {
                    localStorage.removeItem('cart');
                    updateCartCount();
                    renderSidebarCart();
                    
                    // Recarregar página após mais 1 segundo
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                }, 2000);
            } else {
                // Encontrar produto com erro no carrinho
                let produtoComErro = null;
                const mensagem = data.msg || '';
                
                // Tentar extrair nome do produto da mensagem de erro
                const match = mensagem.match(/Produto "(.+?)" não possui/);
                if (match && match[1]) {
                    const nomeProduto = match[1];
                    produtoComErro = cart.find(item => item.name.includes(nomeProduto));
                }
                
                // Mostrar erro no carrinho
                const errorDiv = document.getElementById('cart-error-message');
                const errorText = document.getElementById('cart-error-text');
                const errorImg = document.getElementById('cart-error-img');
                
                if (errorDiv && errorText) {
                    errorText.textContent = data.msg;
                    errorDiv.style.display = 'block';
                    
                    if (produtoComErro && errorImg) {
                        errorImg.src = produtoComErro.img;
                        errorImg.style.display = 'block';
                    } else if (errorImg) {
                        errorImg.style.display = 'none';
                    }
                    
                    // Scroll para o topo do carrinho para ver o erro
                    document.querySelector('.cart-body').scrollTop = 0;
                }
            }
        })
        .catch(error => {
            console.error('Erro ao finalizar pedido:', error);
            
            const errorDiv = document.getElementById('cart-error-message');
            const errorText = document.getElementById('cart-error-text');
            const errorImg = document.getElementById('cart-error-img');
            
            if (errorDiv && errorText && errorImg) {
                errorText.textContent = 'Erro ao processar a compra. Tente novamente.';
                errorDiv.style.display = 'block';
                errorImg.style.display = 'none';
                document.querySelector('.cart-body').scrollTop = 0;
            }
        });
}