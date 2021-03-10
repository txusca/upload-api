require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRoute = require('./routes/indexRouter');
const postsRoute = require('./routes/postsRouter');
const usersRoute = require('./routes/usersRouter');

const app = express();
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
app.use(cors());
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// app.use(require('./routes'));
app.use('/', indexRoute);
app.use('/posts', postsRoute);
app.use('/users', usersRoute);

app.listen(process.env.PORT || 3000);