const router = require('express').Router();
const multer = require('multer');

const multerConfig = require('../config/multer');
const auth = require('../middlewares/authMiddleware');

const Post = require('../models/Post');

router.use(auth);

router.get('/', async (req, res) => {
    const posts = await Post.find().populate('user').lean();
    return res.json({ posts, user: req.userId });
});

// Adiciona a foto e os dados da mesma no banco e no Storage
router.post('/', multer(multerConfig).single('file'), async (req, res) => {

    // Renomeia os atributos para os mesmos que estão no modelo.
    const { originalname: name, size, key, location: url = '' } = req.file;

    const post = await Post.create({
        name,
        size,
        key,
        url,
        user: req.userId
    });

    return res.json({ post: post, id: req.userId });
});

router.delete('/:id', async (req, res) => {
    const response = await Post.remove({ _id: req.params.id });

    return res.send();
});

module.exports = router;