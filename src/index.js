require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(morgan('dev'));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
app.use(cors());
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

app.get('/', (req, res) => {
    res.send('Index page');
});

app.use(require('./routes'));

app.listen(process.env.PORT || 3000);