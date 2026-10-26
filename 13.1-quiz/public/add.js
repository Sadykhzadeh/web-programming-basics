const escapeHtml = (text) => {
  const el = document.createElement('div');
  el.textContent = text;
  return el.innerHTML;
};

const getAllSuppliers = async () => {
  const response = await fetch('/api/suppliers');
  if (!response.ok) throw new Error(`GET /api/suppliers: ${response.status}`);
  const data = await response.json();
  return data;
}

const selectLoading = async () => {
  const supplierElement = document.getElementById('supplier');
  try {
    const suppliers = await getAllSuppliers();
    supplierElement.innerHTML = suppliers.map(supplier => `
      <option value="${supplier.supplierID}">${escapeHtml(supplier.name)}</option>
    `).join('');
  } catch (error) {
    console.error(error);
    // an empty value, so submitting is answered with "fill out all fields"
    supplierElement.innerHTML = '<option value="">Could not load the suppliers.</option>';
  }
}

selectLoading()

const submitForm = async (event) => {
  event.preventDefault();
  const productCode = document.getElementById('productCode').value;
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;
  const supplierID = document.getElementById('supplier').value;

  const response = await fetch('/api/suppliers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productCode,
      name,
      price,
      quantity,
      supplierID,
    })
  });

  const data = await response.json();
  if (response.ok && !data.warningStatus) {
    alert("Product added successfully");
    window.location.href = '/';
  } else {
    alert(data.message || "Error adding product");
  }
}

  
document.getElementById("submit").addEventListener("click", submitForm);