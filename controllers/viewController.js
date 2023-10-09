const Jewellery = require("../models/jewelleryModel");
const Products = require("../models/otherProductsModel");
const APIFeatures= require("../utils/apiFeatures")
const Order = require('../models/orderModel')
const Posts = require('../models/postModel')
const catchAsync = require('./../utils/catchAsync')
const NewsLetter = require('../models/newsLetterModel')


exports.home = catchAsync(async (req, res, next) => {
  let bestSeller = await  Jewellery.find().limit(8)
  // bestSeller=bestSeller.concat(await Products.find().limit(4))
  // console.log(bestSeller)
  let posts = await Posts.find({}).limit(8)
  let products = await Products.find().limit(10)
  res.status(200).render("index",{bestSeller,products,posts} );
});

exports.about = catchAsync(async (req, res, next) => {
  res.status(200).render("about");
});

exports.contact = catchAsync(async (req, res, next) => {
  res.status(200).render("contact");
});

exports.error = catchAsync(async (req, res, next) => {
  res.status(200).render("error");
});

exports.shop = catchAsync(async (req, res, next) => {
  let items
  if (req.params.category == 'rings' || req.params.category == 'bracelets' || req.params.category == 'necklaces'){
    items =  Jewellery.find({category: req.params.category})
  }else{
    items =  Products.find({category: req.params.category})
    
  }

    // SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      items = await items.sort(sortBy);
      // return this;
    } else {
      items = await items.sort('discountedPrice');
      // return this;
    }
    console.log(items)
  res.status(200).render('shop', {items});
});

exports.product = catchAsync(async (req, res, next) => {
  let product = await Jewellery.findOne({_id: req.params.id})
  let relatedProducts
  if(product){
    relatedProducts = await Jewellery.find({category: product.category})
  }else{
    product = await Products.findOne({_id: req.params.id})
    relatedProducts = await Products.find({category: product.category})
  }
  // console.log(product)
  res.status(200).render('product',{product,relatedProducts});
});

exports.checkout = catchAsync(async (req, res, next) => {
  // console.log(req.cookies.cart)
  // let checkoutCart= req.cookies.cart
  // console.log(checkoutCart)
  res.status(200).render('checkout');
});

exports.cart = catchAsync(async (req, res, next) => {
  res.status(200).render('cart');
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('login');
});

exports.dashboardHome = catchAsync(async (req, res, next) => {
  let orders = await Order.find()
  
  res.status(200).render('dashboard/home',{orders});
});

exports.addJewellery= catchAsync(async (req, res, next) => {
  res.status(200).render('dashboard/add-jewellery');
});

exports.addOthers= catchAsync(async (req, res, next) => {
  res.status(200).render('dashboard/add-others');
});

exports.statistics= catchAsync(async (req, res, next) => {
  res.status(200).render('dashboard/statistics');
});

exports.socialMedia= catchAsync(async (req, res, next) => {
  res.status(200).render('dashboard/social-media');
});

exports.newsletters = catchAsync(async (req, res, next) => {
  let newsletters = await NewsLetter.find()
  
  res.status(200).render('dashboard/newsletter',{newsletters});
});
