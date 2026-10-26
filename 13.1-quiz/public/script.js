const escapeHtml = (text) => {
    const el = document.createElement('div');
    el.textContent = text;
    // also quotes, the text is used inside attributes too
    return el.innerHTML.replace(/"/g, '&quot;');
};

const getAllSuppliers = async () => {
    const response = await fetch('/api/suppliers');
    if (!response.ok) throw new Error(`GET /api/suppliers: ${response.status}`);
    const data = await response.json();
    return data;
}

const outputSuppliers = async () => {
    const suppliersElement = document.getElementById('suppliers');
    try {
        const suppliers = await getAllSuppliers();
        suppliersElement.innerHTML = suppliers.map(supplier => `
            <div class="supplier">
                <h3>${escapeHtml(supplier.name)}</h3>
                <p>${escapeHtml(supplier.phone)}</p>
                <button data-supplier="${Number(supplier.supplierID)}" aria-label="View products of ${escapeHtml(supplier.name)}">View Products</button>
                <div class="products" id="supplier-${supplier.supplierID}"></div>
            </div>
            <hr>
        `).join('');
    } catch (error) {
        console.error(error);
        suppliersElement.textContent = 'Could not load the suppliers.';
    }
}
outputSuppliers();

// one listener for all buttons instead of an onclick attribute per supplier
document.getElementById('suppliers').addEventListener('click', (event) => {
    const button = event.target.closest('button[data-supplier]');
    if (button) outputSupplierProducts(button.dataset.supplier);
});

const getSupplierProducts = async (id) => {
    const response = await fetch(`/api/suppliers/${id}`);
    if (!response.ok) throw new Error(`GET /api/suppliers/${id}: ${response.status}`);
    const data = await response.json();
    return data;
}

const outputSupplierProducts = async (id) => {
    const productsElement = document.getElementById(`supplier-${id}`);
    try {
        const products = await getSupplierProducts(id);
        productsElement.innerHTML = products.map(product => `
            <div class="product">
              <h3>${escapeHtml(product.name)}</h3>
              <p>${escapeHtml(product.price)}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error(error);
        productsElement.textContent = 'Could not load the products.';
    }
}