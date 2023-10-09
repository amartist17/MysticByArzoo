const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const orderSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    postcode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.ObjectId,
      ref: "Order",
        },
        name: String,
        price: Number,
        size: Number,
        charm: String
    }],
    details: {
      type: String
    },
    razorpay_payment_id: {
      type: String,
      
    },
    razorpay_order_id: {
      type: String,
      
    },
    razorpay_signature: {
      type: String,
      
    },
    payment: {
      type: String,
      enum: ['cash', 'paid', 'unpaid',"error"],
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    }
  });

  orderSchema.statics.getStatistics = async function () {
    const mostSoldItemThisMonth = await this.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
        },
      },
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: 1 },
          name: { $first: '$items.name' },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 1,
      },
    ]);
  
    const totalIncomeThisMonth = await this.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            },
          },
        },
        {
          $unwind: '$items',
        },
        {
          $group: {
            _id: null,
            totalIncomeThisMonth: { $sum: '$items.price' },
          },
        },
      ]);
    
      const totalIncome = await this.aggregate([
        {
          $unwind: '$items',
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: '$items.price' },
          },
        },
      ]);
  
    const totalItemsSold = await this.aggregate([
      {
        $group: {
          _id: null,
          totalItemsSold: { $sum: 1 },
        },
      },
    ]);
  
    const totalItemsSoldThisMonth = await this.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalItemsSoldThisMonth: { $sum: 1 },
        },
      },
    ]);
  
    const mostSoldCharms = await this.aggregate([
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.charm',
          totalSold: { $sum: 1 },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 1,
      },
    ]);
  
    return {
      mostSoldItemThisMonth,
      totalIncomeThisMonth,
      totalIncome,
      totalItemsSold,
      totalItemsSoldThisMonth,
      mostSoldCharms,
    };
  };
  
  
module.exports = mongoose.model("Order", orderSchema);
