const Product = require('../models/product.model');

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        const groupedProducts = products.reduce((acc, product) => {
            const category = product.category;
            if (!acc[category]) {
                acc[category] = { name: category, description: "", products: [] };
            }
            acc[category].products.push(product);
            return acc;
        }, {});

        const categoriesArray = Object.values(groupedProducts);

        res.status(200).json(categoriesArray);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.createProduct = async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: req.body.image,
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.category = req.body.category || product.category;
        product.image = req.body.image || product.image;

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        await product.deleteOne(); // Usar deleteOne() en lugar de remove()
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};