const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const xssClean = require('xss-clean');
const helmet = require('helmet');
const app = express();
const router = express.Router();

const articleRoute = require('./routes/v1/article.route');
const authRoute = require('./routes/v1/auth.route');
const { errorHandler, notFound } = require('./middlewares/error.middleware');

const csrfProtection = csrf({
  cookie: true,
});

app.use(xssClean());
app.use(helmet());
app.use(cors({ credentials: true }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

router.use('/auth', authRoute);
router.use('/articles', articleRoute);
router.use('/uploads', express.static(path.resolve(__dirname, './uploads')));
router.use(csrfProtection);

// console.log(path.resolve(__dirname, './uploads'));

// check server online
router.get('/', (req, res) => {
  res.json({ timestamp: new Date().toISOString() });
});

router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/v1', router);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
