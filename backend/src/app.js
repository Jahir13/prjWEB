const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const purchaseRoutes = require('./routes/purchase.routes');

dotenv.config();
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/purchases', purchaseRoutes);
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API de la Cafetería!');
});

module.exports = app;