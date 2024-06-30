const Jewellery = require('../models/jewelleryModel')
const Products = require('../models/otherProductsModel')
const Order = require('../models/orderModel')
const Post = require('../models/postModel')
const NewsLetter = require('../models/newsLetterModel')
const catchAsync = require('./../utils/catchAsync')
const crypto = require('crypto');
const dotenv = require("dotenv/config");
const path = require('path');
const email = require('../utils/email')

const Razorpay = require('razorpay');
var instance = new Razorpay({ key_id: process.env.RAZORPAYKEY, key_secret: process.env.RAZORPAYSECRET })

exports.addJewellery = catchAsync(async (req, res, next) => {
  
  console.log(req.body)
  req.body.charms = req.body.charms.split('-');
  req.body.images = req.body.images.split(',');
  let newJewellery = await Jewellery.create(req.body)
  
  // console.log(req.body)
  res.status(200).json({
      status: 'success',
  });
});

exports.addOtherProducts = catchAsync(async (req, res, next) => {
  req.body.images = req.body.images.split(',');
  let newProduct = await Products.create(req.body)
  console.log(req.body)
  // console.log(req.body)
  res.status(200).json({
      status: 'success',
  });
});


  exports.addAllJewellery = catchAsync(async (req, res, next) => {
    let newJewellery = await Jewellery.insertMany(req.body)

    res.status(200).json({
        status: 'success',
        result: newJewellery
    });
  });
  
  exports.addAllOtherProducts = catchAsync(async (req, res, next) => {
    let newProducts = await Products.insertMany(req.body)

    res.status(200).json({
        status: 'success',
        result: newProducts
    });
  });
  exports.removeJewellery =catchAsync( async (req, res, next) => {
    await Jewellery.findByIdAndDelete(req.body.id)
    res.status(200).json({
        status: 'success',
    });

  });

  exports.removeOther = catchAsync(async (req, res, next) => {
    await Products.findByIdAndDelete(req.body.id)
    res.status(200).json({
        status: 'success',
    });

    
  });

  exports.sendCart =catchAsync( async (req, res, next) => {
    if(req.cookies.cart){
      const arr = JSON.parse(req.cookies.cart)
    // let cart= await Jewellery.find({ _id: { $in: arr } })
    // cart= cart.concat(await Products.find({ _id: { $in: arr } }))
    res.locals.cart = arr;
    // console.log('Cart', arr)
    return next()
    }
    
    res.locals.cart = null;
    return next()
  });

  exports.addToCart =catchAsync( async (req, res, next) => {
    let prevCookie=[]
    // console.log(req.body)
    if(req.cookies.cart){
      prevCookie = JSON.parse(req.cookies.cart)
      prevCookie.push((req.body))
    }else{
      prevCookie.push((req.body))
    }
    // console.log(prevCookie)
    prevCookie = prevCookie.filter((value, index, self) => self.findIndex((obj) => obj.productId === value.productId) === index);
    const arr = prevCookie.map(item => item.productId);
    // res.cookie('cartIds', JSON.stringify(arr) , { httpOnly: true })
    res.cookie('cart',JSON.stringify(prevCookie), { httpOnly: true });
  console.log('Updated Cookie Value:', req.cookies.cart);
    res.status(200).json({
        status: 'success',
    });
  });
  
  exports.removeFromCart = catchAsync(async (req, res, next) => {
    let prevCookie
    if(req.cookies.cart){
      prevCookie = JSON.parse(req.cookies.cart)
      prevCookie.pop(req.body.productId)
    }
    // const arr = prevCookie.map(item => item.productId);

    // res.cookie('cartIds', JSON.stringify(arr) , { httpOnly: true })
    res.cookie('cart',JSON.stringify(prevCookie), { httpOnly: true });
    res.status(200).json({
        status: 'success',
    });
  });
  
  
  exports.confirmOrder = catchAsync(async (req, res, next) => {
    // await Jewellery.findByIdAndDelete(req.body.id)
    // console.log("cash", req.body);
    req.body.items = JSON.parse(req.cookies.cart)
    req.body.payment= 'cash'
    let newOrder = await Order.create(req.body)

    const sum = JSON.parse(req.cookies.cart).reduce((accumulator, product) => accumulator + parseInt(product.price), 0);
    res.cookie('cart',"", { httpOnly: true });
    // Example usage
    console.log(req.body.items)

    const orderEmail=`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - MysticcByArzoo</title>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
    
        table, th, td {
          border: 1px solid #ddd;
        }
    
        th, td {
          padding: 12px;
          text-align: left;
        }
    
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
    
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2>Order Confirmation - MysticcByArzoo</h2>
        <p>Thank you for your order! Your order details are as follows:</p>
    
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
          ${req.body.items.map(item=>{
            return (" <tr><td>"+ item.name
            +"</td><td>"+ item.price+"</td></tr>")
          })}
           
              
            
            
          </tbody>
        </table>
    
        <div style="margin-top: 20px; text-align: center; color: #888;">
          <p>Date: ${newOrder.date.toLocaleDateString('en-us', { hour: '2-digit',minute: '2-digit', hour12: false,}) }</p>
        </div>
      </div>
    
    </body>
    </html>`
    email.sendEmail(req.body.email, "Order Confirm", orderEmail);

    res.status(200).json({
        status: 'success',
        order: res.locals.cart,
        sum
    });

  });

  exports.createOrder = catchAsync(async (req, res, next) => {
    // await Jewellery.findByIdAndDelete(req.body.id)
    const sum = JSON.parse(req.cookies.cart).reduce((accumulator, product) => accumulator + parseInt(product.price), 0);
    console.log(req.body);
    req.body.items = JSON.parse(req.cookies.cart)
    req.body.payment= 'unpaid'
    let newOrder = await Order.create(req.body)
    let userDetails= {
      _id:newOrder._id,
      name: req.body.firstName + ' ' + req.body.lastName,
      email: req.body.email,
      phone: req.body.phone
    }
    const options = {
      amount: sum * 100, // amount in the smallest currency unit
      currency: "INR",
      
    };
    instance.orders.create(options, async function (err, order) {
      // console.log(order);
      return res.json({ orderId: order.id, key: process.env.RAZORPAYKEY,sum, userDetails });
    });
    
  });

  exports.success = catchAsync(async (req, res, next) => {
    const updateFields = {
      payment: 'paid',
      razorpay_signature:req.body.razorpay_signature,
      razorpay_order_id:req.body.razorpay_order_id,
      razorpay_payment_id:req.body.razorpay_payment_id,
    };
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAYSECRET);
    hmac.update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id);
    let generated_signature = hmac.digest('hex');
    // let generated_signature = crypto.createHmac(req.body.razorpay_order_id + "|" 
    // + req.body.razorpay_payment_id, process.env.RAZORPAYSECRET);

  if (generated_signature == req.body.razorpay_signature) {
    let order=await Order.findByIdAndUpdate(req.body.orderId,  updateFields  , { new: true })
    items = JSON.parse(req.cookies.cart)
    const orderEmail=`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - MysticcByArzoo</title>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
    
        table, th, td {
          border: 1px solid #ddd;
        }
    
        th, td {
          padding: 12px;
          text-align: left;
        }
    
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
    
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2>Order Confirmation - MysticcByArzoo</h2>
        <p>Thank you for your order! Your order details are as follows:</p>
    
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
          ${items.map(item=>{
            return (" <tr><td>"+ item.name
            +"</td><td>"+ item.price+"</td></tr>")
          })}
           
              
            
            
          </tbody>
        </table>
    
        <div style="margin-top: 20px; text-align: center; color: #888;">
          <p>Date: ${order.date.toLocaleDateString('en-us', { hour: '2-digit',minute: '2-digit', hour12: false,}) }</p>
        </div>
      </div>
    
    </body>
    </html>`
    email.sendEmail(order.email, "Order Confirm", orderEmail);

  }else{
    await Order.findByIdAndUpdate(req.body.orderId,  {payment:'error'}  , { new: true })
  }
  res.cookie('cart',"", { httpOnly: true });

    res.status(200).json({
        status: 'success',
        
    });

  });

  exports.address = catchAsync(async (req, res, next) => {

    let order = await Order.findOne({_id:req.params._id})
    // console.log(req.body)
    res.status(200).json({
        details: order,
    });
  });

  exports.aggregate = catchAsync(async (req, res, next) => {
    const statistics = await Order.getStatistics();
    // console.log(statistics);
    const aggregate = {
      mostSoldItemThisMonth: statistics.mostSoldItemThisMonth[0] ?? 'null',
      totalIncomeThisMonth: statistics.totalIncomeThisMonth?.[0]?.totalIncomeThisMonth ?? 0,
      totalIncome: statistics.totalIncome?.[0]?.totalIncome ?? 0,
      totalItemsSold: statistics.totalItemsSold?.[0]?.totalItemsSold ?? 0,
      totalItemsSoldThisMonth: statistics.totalItemsSoldThisMonth?.[0]?.totalItemsSoldThisMonth ?? 0,
      mostSoldCharms: statistics.mostSoldCharms[0] ?? 'null'
    };
    
    res.locals.aggregate = aggregate
    // console.log(aggregate);
    return next()
  });

  exports.addPost = catchAsync(async (req, res, next) => {
  
    console.log(req.body)

    let newPost = await Post.create(req.body)
    
    // console.log(req.body)
    res.status(200).json({
        status: 'success',
    });
  });

  exports.addToNewsLetter = catchAsync(async (req, res, next) => {
  
    console.log(req.body)
    
    let newEntry = await NewsLetter.create(req.body)
    
    // console.log(req.body)
    res.redirect('/')
  });

 