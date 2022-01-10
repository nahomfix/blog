const express = require('express');
const app = express();
require('dotenv').config();

app.get('/', (req, res) => {
  res.json({ timestamp: new Date().toISOString() });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});
