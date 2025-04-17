const { Where } = require("sequelize/lib/utils");
const Car = require("../schemas/car");
const carService = {
  // Function to get all brands
  getAllBrands: async (type) => {
    try {
      const brands = await Car.findAll({
        attributes: ["maker"],
        group: ["maker"],
        order: ["maker"],
        where: { vehicleType: type },
      });
      const makers = brands.map((brand) => brand.get({ plain: true }).maker);
      return makers;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // Function to get models by brand
  getModelsByBrand: async (brand, type) => {
    try {
      const models = await Car.findAll({
        where: { maker: brand, vehicleType: type },
        attributes: ["model"],
        group: ["model"],
        order: ["model"],
      });
      // console.log(models);
      const carModels = models.map((model) => model.get({ plain: true }).model);
      return carModels;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // Function to get years by model and brand
  getYearsByModel: async (brand, model, type) => {
    try {
      const years = await Car.findAll({
        where: { maker: brand, model: model, vehicleType: type },
        attributes: ["year"],
        group: ["year"],
        order: ["year"],
      });
      const carYears = years.map((year) => year.get({ plain: true }).year);
      return carYears;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getCarsByBrandModelYear: async (brand, model, year, type) => {
    try {
      const cars = await Car.findAll({
        where: { maker: brand, model: model, year: year, vehicleType: type },
      });
      const carDetails = cars.map((car) => car.get({ plain: true }));
      return carDetails;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
module.exports = carService;
