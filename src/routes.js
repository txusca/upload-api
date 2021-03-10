const routes = require('express').Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Configuração feita para o multer com a configuração do multer e do multer-s3
const multerConfig = require('./config/multer');

const Post = require('./models/Post');
const User = require('./models/User');

// Função para assinar tokens
function generateToken(params = {}) {
    return jwt.sign(params, process.env.SECRET, {
        expiresIn: 300
    });
}

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate.' });
        req.userId = decoded.id;
        next();
    });

}

// Rota inicial
routes.get('/', (req, res) => {
    res.json({
        message: `Esta é uma API para armazenamento de imagens com um tamanho de no máximo 2 mb`,
        routes: '/posts'
    })
});

// Get de todas as fotos armazenadas no banco e no Storage
routes.get('/posts', async (req, res) => {
    const posts = await Post.find().populate('user').lean();
    return res.json(posts);
});

// Adiciona a foto e os dados da mesma no banco e no Storage
routes.post('/posts', verifyJWT, multer(multerConfig).single('file'), async (req, res) => {

    // Renomeia os atributos para os mesmos que estão no modelo.
    const { originalname: name, size, key, location: url = '' } = req.file;

    const post = await Post.create({
        name,
        size,
        key,
        url
    });

    return res.json({ post: post, id: req.userId });
});

// Remoção dos arquivos e do dado no banco de dados
routes.delete('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id).lean();

    await post.remove();

    return res.send();
});

routes.get('/user', async (req, res) => {
    const users = await User.find().lean();

    return res.json(users);
});

routes.post('/user', async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.json(user);
    } catch (err) {
        res.json({ error: err });
    }
});

routes.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).select('+password').lean();

    if (!user)
        return res.status(400).json({ error: 'Usuário não encontrado' })

    if (!await bcrypt.compare(password, user.password))
        res.status(400).json({ error: 'Senha inválida' });

    res.status(200).json({
        auth: true, token: generateToken({ id: user.id })
    });

});


module.exports = routes;