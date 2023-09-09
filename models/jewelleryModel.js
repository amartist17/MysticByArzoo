const mongoose = require('mongoose');

// Define the product schema
const jewellerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  price:{
    type: Number,
    required: true
  },
  discountedPrice:{
    type: Number,
    required: true
  },
  sizes: [
    {
      type: String,
    },
  ],
  charms: [
    {
      type: String,
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  category: {
    type: String,
    enum: ['rings', 'bracelets', 'necklaces'],
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdOn:{
    type: Date,
    default: new Date()
  }
});

// Create the Product model using the schema
const Jewellery = mongoose.model('Jewellery', jewellerySchema);

module.exports = Jewellery;
