const carService = require('../services/car');
const carController = {
  // Function to get all brands
  getAllBrands: async (req, res) => {
    try {
      const result = await carService.getAllBrands(req.params.type);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  // Function to get models by brand
  getModelsByBrand: async (req, res) => {
    try {
      const result = await carService.getModelsByBrand(req.params.brand, req.params.type);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  // Function to get years by model and brand
  getYearsByModel: async (req, res) => {
    try {
      const result = await carService.getYearsByModel(req.params.brand, req.params.model, req.params.type);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getCarsByBrandModelYear: async (req, res) => {
    try {
      const result = await carService.getCarsByBrandModelYear(req.params.brand, req.params.model, req.params.year, req.params.type);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

module.exports = carController;