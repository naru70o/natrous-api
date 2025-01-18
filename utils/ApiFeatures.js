class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = queryString; // Request query parameters
  }

  filter() {
    // STEP 1: Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // STEP 2: Advanced Filtering (e.g., price[gt]=100)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this; // Return the object for chaining
  }

  sort() {
    // STEP 3: Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // Default sorting
    }

    return this; // Return the object for chaining
  }

  limitFields() {
    // STEP 4: Fields Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Exclude the __v field by default
    }

    return this; // Return the object for chaining
  }

  paginate() {
    // STEP 5: Pagination
    const page = this.queryString.page * 1 || 1; // Default page is 1
    const limit = this.queryString.limit * 1 || 10; // Default limit is 10
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    this.query = this.query.skip(skip).limit(limit);

    return this; // Return the object for chaining
  }
}

module.exports = APIFeatures;
