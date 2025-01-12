const express = require('express');

const app = express();
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;

// tichnique one
// app.delete('/api/v1/tours/:id', deleteTour);
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addNewTour);
