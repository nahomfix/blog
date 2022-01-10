const express = require('express');
const app = express();
const router = express.Router();
const articleRoute = require('./routes/v1/article.route');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

router.use('/articles', articleRoute);

// check server online
router.get('/', (req, res) => {
  res.json({ timestamp: new Date().toISOString() });
});

app.use('/api/v1', router);

module.exports = app;
