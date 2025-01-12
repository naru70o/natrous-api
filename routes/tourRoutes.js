const express = require('express');
const fs = require('fs');
const {
  getAllTours,
  addNewTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/').get(getAllTours).post(addNewTour);
router.route('/:id').delete(deleteTour);

module.exports = router;
