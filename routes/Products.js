const express = require('express');
const router = express.Router();

const Product = require('../models/Products');

const upload = require('../middlewares/uploads');
// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        console.log('Productos obtenidos:', products);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Crear un nuevo producto
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, cantidad, precio, descripcion } = req.body;
        const product = new Product({
            nombre,
            cantidad: parseInt(cantidad),
            precio: parseFloat(precio),
            descripcion,
            imagen: req.file ? req.file.filename : null
        });
        const savedProduct = await product.save();
        console.log('Producto guardado:', savedProduct);
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Actualizar un producto
router.put('/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, cantidad, precio, descripcion } = req.body;
        const updateData = {
            nombre,
            cantidad: parseInt(cantidad),
            precio: parseFloat(precio),
            descripcion
        };
        if (req.file) {
            updateData.imagen = req.file.filename;
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
