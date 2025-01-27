const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['efectivo', 'tarjeta'], // Métodos de pago permitidos
        required: true,
    },
    serveOption: {
        type: String,
        enum: ['mesa', 'llevar'], // Opciones de servir
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'], // Estados de la compra
        default: 'pending',
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Purchase', purchaseSchema);