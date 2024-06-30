const mongoose = require('mongoose');
const _ = require('lodash');
// Define the product schema
const otherProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },

  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  discountedPrice: {
    type: Number,
  },

  images: [
    {
      type: String,
    },
  ],
  category: {
    type: String,
    enum: [
      'clusters',
      'tumbles',
      'rawform',
      'towerwands',
      'sphere',
      'rollerguasha',
      'freeform',
      'herbsandsmudging',
      'candles',
      'detoxbath',
      'singingbowls',
      'exclusivepremiumcollection',
      'men'
    ],
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

otherProductsSchema.pre('save', function (next) {
 
  this.name = _.capitalize(this.name)
  
  next();
});

// Create the Product model using the schema
const OtherProducts = mongoose.model('OtherProducts', otherProductsSchema);

module.exports = OtherProducts;
