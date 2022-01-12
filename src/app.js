const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const router = express.Router();
const articleRoute = require('./routes/v1/article.route');
const authRoute = require('./routes/v1/user.route');
const { errorHandler } = require('./middlewares/error.middleware');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

router.use('/auth', authRoute);
router.use('/articles', articleRoute);
router.use('/uploads', express.static(path.resolve(__dirname, './uploads')));

console.log(path.resolve(__dirname, './uploads'));

// check server online
router.get('/', (req, res) => {
  res.json({ timestamp: new Date().toISOString() });
});

app.use('/api/v1', router);

app.use(errorHandler);

module.exports = app;
