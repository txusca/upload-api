const router = require('express').Router();

const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const user = await User.create(req.body);
        return res.json(user);
    } catch (err) {
        res.json({ error: err });
    }
});

module.exports = router;