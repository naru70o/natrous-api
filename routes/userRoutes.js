const express = require('express');
const {
  addNewUser,
  getAllUsers,
  getUser,
  UpdateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// users
router.route('/').post(addNewUser).get(getAllUsers);

// user
router.route('/:id').get(getUser).patch(UpdateUser).delete(deleteUser);

module.exports = router;
