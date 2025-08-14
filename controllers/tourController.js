const { Tour } = require('../models/tourModel');
const prisma = require('./../prisma');
const APIFeatures = require('../utils/ApiFeatures');

exports.topTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// aggregation pipelines
exports.mostBookedMonth = async (req, res) => {
  try {
    const busiestMonth = await Tour.aggregate([
      // STEP 1: Unwind the startDates array
      { $unwind: '$startDates' },

      // STEP 2: Extract the month from each startDate
      {
        $project: {
          month: { $month: '$startDates' } // Extract month (1-12)
        }
      },

      // STEP 3: Group by month and count the number of tours
      {
        $group: {
          _id: '$month', // Group by month
          numTours: { $sum: 1 } // Count the number of tours
        }
      },

      // STEP 4: Sort by the number of tours in descending order
      { $sort: { numTours: -1 } }

      // STEP 5: Limit to the top result (busiest month)
      // { $limit: 1 }
    ]);

    // STEP 6: Send the response
    res.status(200).json({
      status: 'success',
      data: {
        busiestMonth // Return the busiest month
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // const features = new APIFeatures(Tour.find(), req.query)
    //   .filter()
    //   .sort()
    //   .limitFields()
    //   .paginate();

    // STEP 3: Execute the query
    const tours = await prisma.tour.findMany();
    // this how the query look like quer.sort().select().skip().limit()
    // this is called chaining and it is possible becouse the query is an
    //  object the we can chain methods on it and return it then wait for the result

    res.status(200).json({
      status: 'success',
      results: tours.length,
      tours
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await prisma.tour.findUnique({ where: { id: req.params.id } });
    res.status(200).json({
      status: 'success',
      message: 'tour found',
      tour
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'tour not founs'
    });
  }
};

// exports.getAllTours = async (req, res) => {
//   try {
//     // STEP 1: Filtering
//     // Copy the query object
//     const queryObj = { ...req.query };

//     // Exclude fields that are not for filtering (e.g., sort, page, limit)
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach(el => delete queryObj[el]);

//     // STEP 2: Advanced Filtering (e.g., price[gt]=100)
//     // Convert the query object to a string
//     let queryStr = JSON.stringify(queryObj);

//     // Replace gt, gte, lt, lte with $gt, $gte, $lt, $lte (MongoDB operators)
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

//     // Parse the string back to an object
//     let query = Tour.find(JSON.parse(queryStr));

//     // SORTING
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');
//       console.log(sortBy);
//       query = query.sort(sortBy);
//     } else {
//       console.log('Default sorting by duration');
//       query = query.sort('-createdAt');
//     }

//     // FIELD LIMITING
//     if (req.query.fields) {
//       const fields = req.query.fields.split(',').join(' ');
//       query = query.select(fields);
//     } else {
//       query = query.select('-__v');
//     }

//     //  Pagination
//     const page = req.query.page * 1 || 1; // Default page is 1
//     const limit = req.query.limit * 1 || 10; // Default limit is 10
//     const skip = (page - 1) * limit; // Calculate the number of documents to skip

//     query = query.skip(skip).limit(limit);

//     if (req.query.page) {
//       const numTours = await Tour.countDocuments();
//       if (skip >= numTours) throw new Error('This page does not exist');
//     }

//     // STEP 3: Execute the query
//     const tours = await query;
//     // this how the query look like quer.sort().select().skip().limit()
//     // this is called chaining and it is possible becouse the query is an
//     //  object the we can chain methods on it and return it then wait for the result

//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       tours
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err.message
//     });
//   }
// };

// exports.getTour = async (req, res) => {
//   try {
//     const tour = await Tour.findById(req.params.id);
//     res.status(200).json({
//       status: 'success',
//       message: 'tour found',
//       tour
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: 'fail',
//       message: 'tour not founs'
//     });
//   }
// };
// 

exports.addNewTour = async (req, res) => {
  const createdTour = req.body;
  console.log(createdTour);

  try {
    const newTour = await prisma.tour.create({
      data: createdTour
    });
    res.status(201).json({
      status: 'success',
      message: 'new tour added successfully',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await prisma.tour.update({
      where: { id: req.params.id },
      data: req.body
    });

    if (!updatedTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found'
      });
    }

    // If the tour is found, update it
    res.status(200).json({
      status: 'success',
      message: 'Tour updated successfully',
      updatedTour
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
};

exports.addNewTours = async (req, res) => {
  try {
    // Check if the request body is an array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Request body should be an array of tours'
      });
    }

    // Insert multiple tours into the database
    const newTours = await Tour.insertMany(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Tours added successfully',
      data: {
        tours: newTours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await prisma.tour.delete({ where: { id: req.params.id } });
    res.status(201).json({
      status: 'success',
      message: 'Tour Deleted'
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Tour Not Found'
    });
  }
};

exports.deleteAllTours = async (req, res) => {
  try {
    const result = await Tour.deleteMany({});

    console.log(`${result.deletedCount} tours deleted successfully.`);
    res.status(200).json({
      status: 'success',
      message: `${result.deletedCount} tours deleted successfully.`
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `Error deleting tours`
    });
    console.error('Error deleting tours:', err);
  }
};
