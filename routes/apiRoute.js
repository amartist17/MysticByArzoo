const express = require("express");
const apiController = require('../controllers/apiController')
const authController = require('../controllers/authController')
const router = express.Router({ mergeParams: true });


router.post("/signup", authController.signup);
router.post("/login", authController.login);


router.post("/add-to-cart", apiController.addToCart);
router.post("/remove-from-cart", apiController.removeFromCart);
router.post("/add-all-jewellery",authController.protect, apiController.addAllJewellery);
router.post("/add-jewellery",authController.protect, apiController.addJewellery);
router.post("/remove-jewellery",authController.protect, apiController.removeJewellery);

module.exports = router;
