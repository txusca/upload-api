require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(morgan('dev'));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

app.get('/', (req, res) => {
    res.send('Index page');
});

app.use(require('./routes'));

app.listen(3000);