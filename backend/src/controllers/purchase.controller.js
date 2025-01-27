const Purchase = require('../models/purchase.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

exports.getPurchaseHistory = async (req, res) => {
    try {
        const purchases = await Purchase.find({ userId: req.userId }).populate('products.productId');
        res.status(200).json(purchases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePurchaseStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const purchase = await Purchase.findById(req.params.id);

        if (!purchase) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }

        purchase.status = status;
        await purchase.save();

        res.status(200).json(purchase);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPurchase = async (req, res) => {
    try {
        const { products, paymentMethod, serveOption } = req.body;

        // Validar que los productos sean un array y no esté vacío
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Debe proporcionar al menos un producto.' });
        }

        // Validar que la cantidad sea un número positivo
        for (const item of products) {
            if (typeof item.quantity !== 'number' || item.quantity <= 0) {
                return res.status(400).json({ message: 'La cantidad debe ser un número positivo.' });
            }
        }

        let totalAmount = 0;
        const productsWithPrice = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) {
                    throw new Error(`Producto con ID ${item.productId} no encontrado`);
                }
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                };
            })
        );

        for (const item of productsWithPrice) {
            totalAmount += item.price * item.quantity;
        }

        const purchase = new Purchase({
            userId: req.userId,
            products: productsWithPrice,
            totalAmount,
            paymentMethod, // Método de pago
            serveOption,   // Opción de servir en mesa o llevar
            status: 'pending', // Estado inicial de la compra
        });

        await purchase.save();
        res.status(201).json(purchase);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPurchaseHistory = async (req, res) => {
    try {
        const purchases = await Purchase.find({ userId: req.userId }).populate('products.productId');
        res.status(200).json(purchases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};