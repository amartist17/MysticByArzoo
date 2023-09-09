const express = require("express");
const viewController = require('../controllers/viewController')
const authController = require('../controllers/authController')
const apiController = require('../controllers/apiController')
const router = express.Router({ mergeParams: true });

router.use(authController.isLoggedIn);
router.use(apiController.sendCart);

router.get("/", viewController.home);
router.get("/about", viewController.about);
router.get("/contact", viewController.contact);
// router.get("/shop", viewController.shop);
router.get("/shop/:category", viewController.shop);
router.get("/checkout", viewController.checkout);
router.get("/cart", viewController.cart);
router.get("/product/:id", viewController.product);
router.get("/login", viewController.login);
router.get("/dashboard", viewController.addFile);
// router.get("/dashboard/add-user", viewController.addUser);
// router.get("/dashboard", viewController.addFolder);


module.exports = router;
