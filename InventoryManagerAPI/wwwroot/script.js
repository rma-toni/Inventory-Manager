let editing = false;
let currentLang = 'en';
const API_URL = '/api/inventory';

async function loadProducts() {
    const res = await fetch(API_URL);
    const products = await res.json();
    const body = document.getElementById('body-table');

    body.innerHTML = products.map(p => `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.name}</td>
                        <td>$${p.price}</td>
                        <td>${p.stockQuantity}</td>
                        <td>
                            <button onclick="del(${p.id})" class="btn btn-outline-danger btn-sm">${i18n[currentLang].delBtn}</button>
                            <button onclick="prepModify(${p.id}, '${p.name}', ${p.price}, ${p.stockQuantity})" class="btn btn-outline-warning btn-sm">${i18n[currentLang].modBtn}</button>
                        </td>
                    </tr>
                `).join('');
}

function changeLang(lang) {
    currentLang = lang;
    const texts = i18n[lang];

    document.getElementById('txt-title').innerText = texts.title;
    document.getElementById('txt-add-title').innerText = texts.addTitle;
    document.getElementById('inputName').placeholder = texts.placeholderName;
    document.getElementById('th-name').innerText = texts.thName;
    document.getElementById('th-price').innerText = texts.thPrice;
    document.getElementById('th-stock').innerText = texts.thStock;
    document.getElementById('th-actions').innerText = texts.thActions;

    const btn = document.getElementById('main-btn');
    btn.innerText = editing ? texts.btnUpdate : texts.btnSave;

    loadProducts();
}

async function add() {
    const newP = {
        id: parseInt(document.getElementById('inputId').value),
        name: document.getElementById('inputName').value,
        price: parseFloat(document.getElementById('inputPrice').value),
        stockQuantity: parseInt(document.getElementById('inputStock').value)
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newP)
    });

    if (res.ok) {
        loadProducts();
        document.querySelectorAll('input').forEach(i => i.value = '');
    } else {
        const err = await res.json();
        alert("Error: " + (err.title || "Wrong data"));
    }
}

async function del(id) {
    if (confirm('Do you want to remove this product?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadProducts();
    }
}

function prepModify(id, name, price, stock) {
    document.getElementById('inputId').value = id;
    document.getElementById('inputName').value = name;
    document.getElementById('inputPrice').value = price;
    document.getElementById('inputStock').value = stock;

    editing = true;
    document.getElementById('inputId').readOnly = true; // Id locked

    // Transform Button
    const btn = document.getElementById('main-btn');
    btn.innerText = i18n[currentLang].btnUpdate;
    btn.classList.remove('btn-success');
    btn.classList.add('btn-warning');
}

// Button Action
async function execAction() {
    if (editing) {
        await update();
    } else {
        await add();
    }
    resetForm();
}

// Clean
function resetForm() {
    editing = false;
    document.getElementById('inputId').readOnly = false;
    document.querySelectorAll('input').forEach(i => i.value = '');

    // Button to original form
    const btn = document.getElementById('main-btn');
    btn.innerText = i18n[currentLang].btnSave;
    btn.classList.replace('btn-warning', 'btn-success');
}

async function update() {
    const id = document.getElementById('inputId').value;

    const editedProduct = {
        id: parseInt(id),
        name: document.getElementById('inputName').value,
        price: parseFloat(document.getElementById('inputPrice').value),
        stockQuantity: parseInt(document.getElementById('inputStock').value)
    };

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProduct)
    });

    if (res.ok) {
        alert("Product updated successfully");
        document.getElementById('inputId').readOnly = false; // unlock ID
        document.querySelectorAll('input').forEach(i => i.value = ''); // clean
        loadProducts(); // refresh
    } else {
        alert("Error updating product");
    }
}

loadProducts();