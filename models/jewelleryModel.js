const mongoose = require('mongoose');
const _ = require('lodash');
// Define the product schema
const jewellerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  material: {
    type: String,
    required: [true, 'Material is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  discountedPrice: {
    type: Number,
    required: [true, 'Discounted Price is required'],
  },
  charms: [
    {
      name: String,
      price: Number,
    },
    
  ],
  images: [
    {type: String,}
  ],
  category: {
    type: String,
    enum: ['rings', 'bracelets', 'necklaces'],
    required: [true, 'Category is required'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
});




jewellerySchema.pre('save', function (next) {

  const fieldsToCapitalize = ['name', 'material', 'category'];
  for (const field of fieldsToCapitalize) {
    if (this.isModified(field)) {
      // Capitalize the field using lodash
      this[field] = _.capitalize(this[field]);
    }
  }
 
  next();
});

// Create the Product model using the schema
const Jewellery = mongoose.model('Jewellery', jewellerySchema);

module.exports = Jewellery;
