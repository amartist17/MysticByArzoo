const Jewellery = require("../models/jewelleryModel");
const Products = require("../models/otherProductsModel");
const APIFeatures= require("../utils/apiFeatures")

exports.home = async (req, res, next) => {
  let bestSeller = await  Jewellery.find().limit(8)
  // bestSeller=bestSeller.concat(await Products.find().limit(4))
  // console.log(bestSeller)
  let products = await Products.find().limit(10)
  res.status(200).render("index",{bestSeller,products} );
};

exports.about = async (req, res, next) => {
  res.status(200).render("about");
};

exports.contact = async (req, res, next) => {
  res.status(200).render("contact");
};

exports.error = async (req, res, next) => {
  res.status(200).render("error");
};

exports.shop = async (req, res, next) => {
  let items
  if (req.params.category == 'rings' || req.params.category == 'bracelets' || req.params.category == 'necklaces'){
    items =  Jewellery.find({category: req.params.category})
  }else{
    items =  Products.find()

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
  res.status(200).render('shop', {items});
};

exports.product = async (req, res, next) => {
  let product = await Jewellery.findOne({_id: req.params.id})
  let relatedProducts
  if(product){
    relatedProducts = await Jewellery.find({category: product.category})
  }else{
    console.log("hi")
    product = await Products.findOne({_id: req.params.id})
    relatedProducts = await Products.find({category: product.category})
  }
  console.log(product)
  res.status(200).render('product',{product,relatedProducts});
};

exports.checkout = async (req, res, next) => {
  res.status(200).render('checkout');
};

exports.cart = async (req, res, next) => {
  res.status(200).render('cart');
};

exports.login = async (req, res, next) => {
  res.status(200).render('login');
};

exports.dashboardHome = async (req, res, next) => {
  res.status(200).render('dashboard/home');
};

exports.addJewellery= async (req, res, next) => {
  res.status(200).render('dashboard/add-jewellery');
};

exports.addOthers= async (req, res, next) => {
  res.status(200).render('dashboard/add-others');
};


