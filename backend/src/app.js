const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');  // Importa path
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const purchaseRoutes = require('./routes/purchase.routes');

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

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
