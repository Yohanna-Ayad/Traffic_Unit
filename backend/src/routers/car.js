const express = require("express");
const bodyParser = require('body-parser');
const router = new express.Router();
const carController = require('../controllers/car')

router.use(bodyParser.urlencoded({ extended: true }));

//              Get All Brands
router.get("/cars/brands/:type", carController.getAllBrands);

//              Get Models by Brand
router.get("/cars/models/:brand/:type", carController.getModelsByBrand);

//              Get Years by Model and Brand
router.get("/cars/years/:brand/:model/:type", carController.getYearsByModel);

//             Get Cars by Brand, Model and Year
router.get("/cars/:brand/:model/:year/:type", carController.getCarsByBrandModelYear);

module.exports = router;

