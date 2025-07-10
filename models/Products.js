const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    imagen: {
        type: String,
        required: false
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Product', productSchema)
