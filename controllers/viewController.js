const Jewellery = require("../models/jewelleryModel");
const APIFeatures= require("../utils/apiFeatures")

exports.home = async (req, res, next) => {
  res.status(200).render("index");
};

exports.about = async (req, res, next) => {
  res.status(200).render("about");
};

exports.contact = async (req, res, next) => {
  res.status(200).render("contact");
};

exports.shop = async (req, res, next) => {
  let items =  Jewellery.find({category: req.params.category})

    // SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      items = await items.sort(sortBy);
      // return this;
    } else {
      items = await items.sort('discountedPrice');
      // return this;
    }
  // console.log(items);
  res.status(200).render('shop', {items});
};

exports.product = async (req, res, next) => {
  let product = await Jewellery.findOne({_id: req.params.id})
  let products = await Jewellery.findOne({category: product.category})
  res.status(200).render('product',{product,products});
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

exports.addFile = async (req, res, next) => {
  res.status(200).render('dashboard/add-file');
};

