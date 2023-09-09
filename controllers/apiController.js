const Jewellery = require('../models/jewelleryModel')

exports.addJewellery = async (req, res, next) => {
    let newJewellery = await Jewellery.create(req.body)

    res.status(200).json({
        staus: 'success',
    });
  };

  exports.addAllJewellery = async (req, res, next) => {
    let newJewellery = await Jewellery.insertMany(req.body)

    res.status(200).json({
        staus: 'success',
        result: newJewellery
    });
  };
  
  exports.removeJewellery = async (req, res, next) => {
    await Jewellery.findByIdAndDelete(req.body.id)
    res.status(200).json({
        staus: 'success',
    });

    
  };

  exports.sendCart = async (req, res, next) => {
    if(req.cookies.cart){
    const cart= await Jewellery.find({ _id: { $in: JSON.parse(req.cookies.cart) } })
    // console.log(cart)
    res.locals.cart = cart;
    return next()
    }
    res.locals.cart = null;
    return next()
  };

  exports.addToCart = async (req, res, next) => {
    let prevCookie=[]
    console.log(req.body)
    if(req.cookies.cart){
      prevCookie = JSON.parse(req.cookies.cart)
      prevCookie.push(req.body.productId)
    }else{
      prevCookie.push(req.body.productId)
    }
    res.cookie('cart',JSON.stringify(prevCookie), { httpOnly: true }, () => {
      console.log('Cookie has been set');
      console.log('Updated Cookie Value:', req.cookies.cart); // This will print the updated value
  });
  console.log('Updated Cookie Value:', req.cookies.cart);
    res.status(200).json({
        staus: 'success',
        // result: newJewellery
    });
  };
  
  exports.removeFromCart = async (req, res, next) => {
    let prevCookie
    console.log(req.body)
    if(req.cookies.cart){
      prevCookie = JSON.parse(req.cookies.cart)
      prevCookie.pop(req.body.productId)
    }

    res.cookie('cart',JSON.stringify(prevCookie), { httpOnly: true }, () => {
      console.log('Cookie has been set');
      console.log('Updated Cookie Value:', req.cookies.cart); // This will print the updated value
  });
  console.log('Updated Cookie Value:', req.cookies.cart);
    res.status(200).json({
        staus: 'success',
        // result: newJewellery
    });
  };
  