const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/tienda', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('Conectado a MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err);
});


// Rutas
const productRoutes = require('./routes/Products');
app.use('/api/products', productRoutes);


// Servir archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});