const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    // Tour name with validation
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, // Removes whitespace from both ends
      maxlength: [40, 'A tour name must have 40 characters or fewer'],
      minlength: [10, 'A tour name must have 10 characters or more']
      // validate: [validator.isAlpha, 'Tour name must only contain letters'] // Optional alpha validation
    },

    // URL-friendly version of the name
    slug: String,

    // Duration of the tour
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },

    // Maximum group size for the tour
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },

    // Difficulty level of the tour
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'], // Allowed values
        message: 'Difficulty must be: easy, medium, or difficult' // Error message
      }
    },

    // Average rating of the tour
    ratingsAverage: {
      type: Number,
      default: 4.5, // Default value
      min: [1, 'Rating must be 1.0 or higher'], // Minimum value
      max: [5, 'Rating must be 5.0 or lower'] // Maximum value
    },

    // Number of ratings given
    ratingsQuantity: {
      type: Number,
      default: 0 // Default value
    },

    // Price of the tour
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },

    // Discounted price (optional)
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // Validator ensures discount is less than the regular price
          return val < this.price; // `this` refers to the current document
        },
        message: 'Discount price ({VALUE}) must be below the regular price' // Error message
      }
    },

    // Short summary of the tour
    summary: {
      type: String,
      trim: true, // Removes whitespace
      required: [true, 'A tour must have a description']
    },

    // Detailed description of the tour (optional)
    description: {
      type: String,
      trim: true // Removes whitespace
    },

    // Cover image for the tour
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },

    // Array of additional images
    images: [String],

    // Creation date of the tour (hidden by default)
    createdAt: {
      type: Date,
      default: Date.now(), // Defaults to the current date
      select: false // Excluded from query results by default
    },

    // Array of start dates for the tour
    startDates: [Date],

    // Secret tour flag (hidden tours)
    secretTour: {
      type: Boolean,
      default: false // Defaults to false
    }
  },
  {
    // Enable virtual properties for JSON and object outputs
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// virtual properties are properties that are not stored in the database but are calculated using some other values
tourSchema.virtual('tourNames').get(function() {
  return this.name;
});

// create for me a document middleware that will be called when new tour is created
tourSchema.pre('save', function(next) {
  const slug = this.name;
  this.slug = slugify(slug, { lower: true });
  console.log(`${this.name} was created`);
  next();
});

// Middleware for deleteOne
tourSchema.pre('deleteOne', function(next) {
  console.log('About to delete a document');
  next();
});

exports.Tour = mongoose.model('Tour', tourSchema);
