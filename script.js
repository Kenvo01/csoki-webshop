// Univerzális kosárba tétel függvény
function addToCart(name, price, imgSrc) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Megnézzük, benne van-e már a termék
    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseInt(price),
            imgSrc: imgSrc,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(name + ' hozzáadva a kosárhoz!');
    
    // Ha a kosár oldalon lennénk és ott is van ilyen gomb, frissítsük a nézetet
    if (typeof renderCart === "function") {
        renderCart();
    }
}

// A többi függvényed (renderCart, changeQuantity) változatlan maradhat
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const emptyDiv = document.querySelector('.kosaram-empty');
    const itemsDiv = document.getElementById('kosaram-items');
    
    if (emptyDiv && itemsDiv) {
        itemsDiv.innerHTML = '';
        if (cart.length === 0) {
            emptyDiv.style.display = 'block';
        } else {
            emptyDiv.style.display = 'none';
            let total = 0;
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                const row = document.createElement('div');
                row.className = 'kosaram-row';
                row.innerHTML = `
                    <div class="termek-cell">
                        <img src="${item.imgSrc}" alt="${item.name}" style="width:70px; height:70px; border-radius:3px; object-fit:cover;">
                        <span>${item.name}</span>
                    </div>
                    <div>${item.price} Ft</div>
                    <div class="darabszam-cell">
                        <button onclick="changeQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity('${item.name}', 1)">+</button>
                    </div>
                    <div>${itemTotal} Ft</div>`;
                itemsDiv.appendChild(row);
            });
            
            const summary = document.createElement('div');
            summary.className = 'kosaram-summary';
            summary.textContent = 'Fizetendő: ' + total + ' Ft';
            itemsDiv.appendChild(summary);
        }
    }
}

function changeQuantity(name, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

document.addEventListener('DOMContentLoaded', renderCart);