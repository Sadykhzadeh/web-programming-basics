const getAllSuppliers = async () => {
  const response = await fetch('/api/suppliers');
  const data = await response.json();
  return data;
}

const selectLoading = async () => {
  const suppliers = await getAllSuppliers();
  const supplierElement = document.getElementById('supplier');
  supplierElement.innerHTML = suppliers.map(supplier => `
    <option value="${supplier.supplierID}">${supplier.name}</option>
  `).join('');
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
      'mode': 'no-cors',
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
  if (!data.warningStatus) {
    alert("Product added successfully");
    window.location.href = '/';
  } else {
    alert("Error adding product");
  }
}

  
document.getElementById("submit").addEventListener("click", submitForm);