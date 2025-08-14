const mongoose = require('mongoose');

const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('DB connection successful!'));

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
