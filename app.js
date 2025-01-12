const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

app.listen(3000, () => {
  console.log(`this is the server running on port 3000`);
});
