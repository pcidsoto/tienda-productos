let editingProductId = null;
// Cargar productos al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
});
// Manejar envío del formulario
document.getElementById('product-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const productId = document.getElementById('product-id').value;
    try {
        let response;
        if (editingProductId) {
            // Actualizar producto existente
            response = await fetch(`/api/products/${editingProductId}`, {
                method: 'PUT',
                body: formData
            });
        } else {
            // Crear nuevo producto
            response = await fetch('/api/products', {
                method: 'POST',
                body: formData
            });
        }
        if (response.ok) {
            alert(editingProductId ? 'Producto actualizado correctamente' : 'Producto agregado correctamente');
            this.reset();
            cancelEdit();
            loadProducts();
        } else {
            const error = await response.json();
            alert('Error: ' + error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la solicitud');
    }
});
// Cargar todos los productos
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}
// Mostrar productos en la página
function displayProducts(products) {
    const productsList = document.getElementById('products-list');
    if (products.length === 0) {
        productsList.innerHTML = '<div class="no-products">No hay productos registrados</div>';
        return;
    }
    console.log('Productos a mostrar:', products);
    productsList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <h3>${product.nombre}</h3>
            <p>Cantidad: ${product.cantidad}</p>
            <p>Precio: $${product.precio.toFixed(2)}</p>
            <p>${product.descripcion}</p>
            ${product.imagen ? `<img src="/uploads/${product.imagen}" alt="${product.nombre}" class="product-image">` : ''}
            <button onclick="editProduct('${product._id}')">Editar</button>
            <button onclick="deleteProduct('${product._id}')">Eliminar</button>
        `;
        productsList.appendChild(productItem);
    });
    // Scroll al contenedor de productos
    document.querySelector('.products-container').scrollIntoView({ behavior: 'smooth' });
    // Mostrar mensaje si no hay productos
    if (products.length === 0) {
        productsList.innerHTML = '<div class="no-products">No hay productos registrados</div>';
    }
}
// Editar producto
async function editProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
        // Llenar el formulario con los datos del producto
        document.getElementById('nombre').value = product.nombre;
        document.getElementById('cantidad').value = product.cantidad;
        document.getElementById('precio').value = product.precio;
        document.getElementById('descripcion').value = product.descripcion;
        // Cambiar el título y botón
        document.getElementById('form-title').textContent = 'Editar Producto';
        document.getElementById('submit-btn').textContent = 'Actualizar Producto';
        document.getElementById('cancel-btn').style.display = 'block';
        editingProductId = productId;
        // Scroll al formulario
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error al cargar producto:', error);
        alert('Error al cargar el producto');
    }
}
// Cancelar edición
function cancelEdit() {
    document.getElementById('product-form').reset();
    document.getElementById('form-title').textContent = 'Agregar Producto';
    document.getElementById('submit-btn').textContent = 'Agregar Producto';
    document.getElementById('cancel-btn').style.display = 'none';
    editingProductId = null;
}

// Eliminar producto
async function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Producto eliminado correctamente');
                loadProducts();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar el producto');
        }
    }
}
