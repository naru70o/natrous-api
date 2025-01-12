const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log('get all tours bbe');
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const addNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      console.log(err);
    }
  );

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
};

const deleteTour = (req, res) => {
  // const idHotel = req.params.id;

  const deletedHotel = tours.findIndex((hotel, index) => {
    return hotel.id + 1 === parseInt(req.params.id);
  });

  console.log('this is the hotel that will be gone', typeof deletedHotel);
  if (deletedHotel === -1) {
    res.status(400).send("this hotel doesn't exist");
  }
  tours.splice(deletedHotel, 1);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        console.log("can't delete this hotel", err);
      } else {
        console.log('this hotel was deleted');
      }
    }
  );
  res.status(200).send('the hotel was deleted successfully');
};

// refactoring

// tichnique one
// app.delete('/api/v1/tours/:id', deleteTour);
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addNewTour);

// tichnique one two
app.route('/api/v1/tours').get(getAllTours).post(addNewTour);
app.route('/api/v1/tours/:id').delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
