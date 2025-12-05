const express = require("express");
const HomeController = require("../controllers/homeController");
const DevolucaoController = require("../controllers/devolucaoController");

const router = express.Router();

const homeController = new HomeController();
const devolucaoController = new DevolucaoController();

router.get("/", homeController.homeView);
router.get('/shop', homeController.shopView);
router.get('/about', homeController.aboutView);
router.get('/blog', homeController.blogView);
router.get('/cart', homeController.cartView);
router.get('/contact', homeController.contactView);


module.exports = router;