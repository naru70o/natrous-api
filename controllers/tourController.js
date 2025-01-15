const fs = require('fs');
const Tour = require('../models/tourModel');

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success'
    // results: tours.length,
    // data: {
    //   tours
    // }
  });
};

exports.getTour = (req, res) => {
  // if (!tour) {
  //   return res.json(404, {
  //     status: false,
  //     message: 'there is no tour with this id'
  //   });
  // }

  res.status(200).json({
    status: 'success'
    // data: {
    //   tour
    // }
  });
};

exports.addNewTour = (req, res) => {
  // const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: 1 }, req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(200).send('the hotel was deleted successfully');
};
