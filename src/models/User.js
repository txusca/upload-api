const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
});

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;

    next();
});

module.exports = mongoose.model('User', UserSchema);