const Jewellery = require('../models/jewelleryModel')
const Products = require('../models/otherProductsModel')
const catchAsync = require('./../utils/catchAsync')

async function manageCharms (charmString) {
  const charmPairs = charmString.split('-');
  const charmObjects = [];

  charmPairs.forEach(pair => {
    const [name, priceStr] = pair.split('@');
    const price = parseInt(priceStr, 10);

    if (!isNaN(price)) {
      charmObjects.push({ name, price });
    }
  });

  return charmObjects;
}


exports.addJewellery = catchAsync(async (req, res, next) => {
  req.body.charms = manageCharms(req.body.charms)
  let newJewellery = await Jewellery.create(req.body)
  // console.log(req.body)
  res.status(200).json({
      status: 'success',
  });
});

exports.addOtherProducts = catchAsync(async (req, res, next) => {

  let newProduct = await Products.create(req.body)
  // console.log(req.body)
  res.status(200).json({
      status: 'success',
  });
});


  exports.addAllJewellery = async (req, res, next) => {
    let newJewellery = await Jewellery.insertMany(req.body)

    res.status(200).json({
        status: 'success',
        result: newJewellery
    });
  };
  
  exports.addAllOtherProducts = async (req, res, next) => {
    let newProducts = await Products.insertMany(req.body)

    res.status(200).json({
        status: 'success',
        result: newProducts
    });
  };
  exports.removeJewellery = async (req, res, next) => {
    await Jewellery.findByIdAndDelete(req.body.id)
    res.status(200).json({
        status: 'success',
    });

    
  };

  exports.removeOther = async (req, res, next) => {
    await Products.findByIdAndDelete(req.body.id)
    res.status(200).json({
        status: 'success',
    });

    
  };

  exports.sendCart = async (req, res, next) => {
    if(req.cookies.cart){
    let cart= await Jewellery.find({ _id: { $in: JSON.parse(req.cookies.cart) } })
    cart= cart.concat(await Products.find({ _id: { $in: JSON.parse(req.cookies.cart) } }))
    // console.log(cart)
    res.locals.cart = cart;
    return next()
    }
    res.locals.cart = null;
    return next()
  };

  exports.addToCart = async (req, res, next) => {
    let prevCookie=[]
    // console.log(req.body)
    if(req.cookies.cart){
      prevCookie = JSON.parse(req.cookies.cart)
      prevCookie.push(req.body.productId)
    }else{
      prevCookie.push(req.body.productId)
    }
    prevCookie=prevCookie.filter((value, index, self) => self.indexOf(value) === index);
    res.cookie('cart',JSON.stringify(prevCookie), { httpOnly: true }, () => {
      // console.log('Cookie has been set');
      // console.log('Updated Cookie Value:', req.cookies.cart); // This will print the updated value
  });
  console.log('Updated Cookie Value:', req.cookies.cart);
    res.status(200).json({
        status: 'success',
        // result: newJewellery
    });
  };
  
  exports.removeFromCart = async (req, res, next) => {
    let prevCookie
    // console.log(req.body)
    if(req.cookies.cart){
      prevCookie = JSON.parse(req.cookies.cart)
      prevCookie.pop(req.body.productId)
    }

    res.cookie('cart',JSON.stringify(prevCookie), { httpOnly: true }, () => {
      // console.log('Cookie has been set');
      // console.log('Updated Cookie Value:', req.cookies.cart); // This will print the updated value
  });
  // console.log('Updated Cookie Value:', req.cookies.cart);
    res.status(200).json({
        status: 'success',
        // result: newJewellery
    });
  };
  