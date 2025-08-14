const express = require('express');
const dotenv = require('dotenv');
const prisma = require('./prisma');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

// it works - it's time to migrate then
async function main() {
  // ... you will write your Prisma Client queries here
  const allTours = await prisma.tour.findMany();
  console.log('all tours', allTours);
}

main();

module.exports = app;
// tichnique one
// app.delete('/api/v1/tours/:id', deleteTour);
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addNewTour);
