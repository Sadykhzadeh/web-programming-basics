const getAllSuppliers = async () => {
    const response = await fetch('/api/suppliers');
    const data = await response.json();
    return data;
}

const outputSuppliers = async () => {
    const suppliers = await getAllSuppliers();
    const suppliersElement = document.getElementById('suppliers');
    suppliersElement.innerHTML = suppliers.map(supplier => `
        <div class="supplier">
            <h3>${supplier.name}</h3>
            <p>${supplier.phone}</p>
            <button onclick="outputSupplierProducts(${supplier.supplierID})">View Products</button>
            <div class="products" id="supplier-${supplier.supplierID}"></div>
        </div>
        <hr>
    `).join('');
}
outputSuppliers();

const getSupplierProducts = async (id) => {
    const response = await fetch(`/api/suppliers/${id}`);
    const data = await response.json();
    return data;
}

const outputSupplierProducts = async (id) => {
    const products = await getSupplierProducts(id);
    const productsElement = document.getElementById(`supplier-${id}`);
    productsElement.innerHTML = products.map(product => `
        <div class="product">
          <h3>${product.name}</h3>
          <p>${product.price}</p>
        </div>
    `).join('');
}