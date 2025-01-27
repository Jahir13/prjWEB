const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1h', // El token expira en 1 hora
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken(user._id);

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};