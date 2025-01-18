const express = require('express');
const {
  getAllTours,
  getTour,
  addNewTour,
  addNewTours,
  deleteTour,
  deleteAllTours,
  topTours,
  mostBookedMonth,
  updateTour
} = require('../controllers/tourController');

const router = express.Router();

// param middleware
router.param('id', (req, res, next, val) => {
  console.log('Tour id is: ', val);
  next();
});

router.route('/top-tours').get(topTours, getAllTours);
router.route('/most-booked').get(mostBookedMonth);

router
  .route('/')
  .get(getAllTours)
  .post(addNewTour)
  .post(addNewTours)
  .delete(deleteAllTours);
router
  .route('/:id')
  .delete(deleteTour)
  .get(getTour)
  .patch(updateTour);

module.exports = router;
