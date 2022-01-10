const express = require('express');
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ timestamp: new Date().toISOString() });
});

app.use('/api/v1', router);

module.exports = app;
