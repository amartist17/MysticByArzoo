const express = require("express");
const apiController = require('../controllers/apiController')
const authController = require('../controllers/authController')
const router = express.Router({ mergeParams: true });


// router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);


router.post("/add-to-cart", apiController.addToCart);
router.post("/remove-from-cart", apiController.removeFromCart);
router.post("/add-all-jewellery",authController.protect, authController.restrictTo('admin'),apiController.addAllJewellery);
router.post("/add-all-other-products",authController.protect, authController.restrictTo('admin'),apiController.addAllOtherProducts);
router.post("/add-jewellery", authController.protect,authController.restrictTo('admin'),apiController.addJewellery);
router.post("/add-other-products", authController.protect,authController.restrictTo('admin'),apiController.addOtherProducts);
router.post("/add-post", authController.protect,authController.restrictTo('admin'),apiController.addPost);
router.post("/remove-jewellery",authController.protect, authController.restrictTo('admin'),apiController.removeJewellery);
router.post("/remove-other",authController.protect, authController.restrictTo('admin'),apiController.removeOther);
router.post("/confirm-order",apiController.confirmOrder);
router.post("/create-order",apiController.createOrder);
router.post("/success",apiController.success);
router.get("/address/:_id",authController.protect, authController.restrictTo('admin'),apiController.address);
router.post("/add-to-newsletter",apiController.addToNewsLetter);

module.exports = router;
