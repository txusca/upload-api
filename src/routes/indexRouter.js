const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

function generateToken(params = {}) {
    return jwt.sign(params, process.env.SECRET, {
        expiresIn: 300,
    });
}

router.get('/', (req, res) => {
    res.json({
        message: `Esta é uma API para armazenamento de imagens com um tamanho de no máximo 2 mb`,
        routes: ['/login/',
            '/posts',
            '/users']
    })
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).select('+password').lean();

    if (!user)
        return res.status(400).json({ error: 'Usuário não encontrado' })

    if (!await bcrypt.compare(password, user.password))
        res.status(400).json({ error: 'Senha inválida' });

    res.status(200).json({
        auth: true, token: generateToken({ id: user._id })
    });

});

module.exports = router;