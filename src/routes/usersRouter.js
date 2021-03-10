const router = require('express').Router();

const User = require('../models/User');

router.get('/', async (req, res) => {
    const users = await User.find().lean();

    return res.json(users);
});

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.json(user);
    } catch (err) {
        res.json({ error: err });
    }
});

module.exports = router;