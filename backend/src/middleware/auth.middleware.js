const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const tokenWithoutBearer = token.replace('Bearer ', ''); // Elimina "Bearer " del token
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token inválido.' });
    }
};

module.exports = authMiddleware;