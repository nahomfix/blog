const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');
const connectDB = require('./config/db');

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
