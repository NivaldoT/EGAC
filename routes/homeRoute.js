const express = require("express");
const HomeController = require("../controllers/homeController");

const router = express.Router();

const homeController = new HomeController();
router.get("/", homeController.homeView);
router.get('/shop', homeController.shopView);
router.get('/about', homeController.aboutView);
router.get('/blog', homeController.blogView);
router.get('/cart', homeController.cartView);
router.get('/contact', homeController.contactView);
router.get('/minhas-compras', homeController.minhasComprasView);

module.exports = router;