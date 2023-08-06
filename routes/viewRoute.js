const express = require("express");
const viewController = require('../controllers/viewController')
const router = express.Router({ mergeParams: true });


router.get("/", viewController.home);
router.get("/about", viewController.about);
router.get("/contact", viewController.contact);
router.get("/shop", viewController.shop);
router.get("/login", viewController.login);
router.get("/dashboard", viewController.addFile);
router.get("/dashboard/add-user", viewController.addUser);
router.get("/dashboard", viewController.addFolder);


module.exports = router;
