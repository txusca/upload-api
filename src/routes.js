const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const Post = require('./models/Post');

routes.get('/', (req, res) => {
    res.json({
        message: `Esta é uma API para armazenamento de imagens com um tamanho de no máximo 2 mb`,
        routes: '/posts'
    })
});

routes.get('/posts', async (req, res) => {
    const posts = await Post.find().lean();
    return res.json(posts);
});

routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {

    // Renomeia os atributos para os mesmos que estão no modelo.
    const { originalname: name, size, key, location: url = '' } = req.file;

    const post = await Post.create({
        name,
        size,
        key,
        url
    });

    return res.json(post);
});

routes.delete('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id).lean();

    await post.remove();

    return res.send();
});

module.exports = routes;