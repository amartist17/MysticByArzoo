class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
    filter() {
      // FILTERING
      let queryObj = { ...this.queryString };
      let excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach((field) => delete queryObj[field]);
  
      //  ADVANCE FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
    sort() {
      // SORTING
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
        return this;
      } else {
        this.query = this.query.sort('-rating');
        return this;
      }
    }
    fields() {
      // LIMITING FIELDS
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
        return this;
      } else {
        this.query = this.query.select('-__v');
        return this;
      }
    }
    paginate() {
      // // PAGINATION
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 30;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }
  module.exports = APIFeatures;
  