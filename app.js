const prisma = require("./prisma.js")
const dotenv = require('dotenv');

dotenv.config();
const express = require('express');

const app = express();
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

// it works - it's time to migrate then
async function main() {
  // ... you will write your Prisma Client queries here
  const allTours = await prisma.tour.findMany();
  console.log(allTours);
}

main();

module.exports = app;
// tichnique one
// app.delete('/api/v1/tours/:id', deleteTour);
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addNewTour);
