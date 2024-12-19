const adminService = require("../services/admin");
// const NotFoundError = require('../errors/NotFoundError');
// const ValidationError = require('../errors/ValidationError');
// const ConflictError = require('../errors/ConflictError');

const adminController = {
  // Function to add news to the database         Done
  addNews: async (req, res) => {
    try {
      if (!req.user.permissions.includes(4)) {
        console.error("You do not have permission to perform this action!");
        return res.status(403).send({
          error: "You do not have permission to perform this action!",
        });
      }

      console.log("User have permission to add news");
      payload = {
        news: req.body.news,
        image: req.file,
      };
      // console.log(payload);
      const result = await adminService.addNews(payload);
      if (
        result === "All fields are required!" ||
        result === "No image uploaded."
      ) {
        return res.status(400).send({
          error: result,
        });
      }
      res
        .status(201)
        .send({ message: "News Created successful!", news: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  // Function to add member to the database       Done
  addMember: async (req, res) => {
    if (!req.user.permissions.includes(1)) {
      console.error("You do not have permission to perform this action!");
      return res.status(403).send({
        error: "You do not have permission to perform this action!",
      });
    }
    console.log("User have permission to add member");
    try {
      const payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        permission: req.body.permissions,
      };

      const result = await adminService.addMember(payload);

      if (
        result === "All fields are required!" ||
        result === "Password must be at least 8 characters!" ||
        result === "Failed to create user!" ||
        result === "Permission is required!" ||
        result === "Role does not exist!"
      ) {
        // throw new ValidationError(result);
        return res.status(400).send({
          error: result,
        });
      }
      if (result === "Account Already Exist") {
        return res.status(409).send({
          error: result,
        });
      }
      return res
        .status(201)
        .send({ message: "User Created successful!", user: result });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ error: error.message });
    }
  },
  // Function to get all members from the database     Done
  getLiveDiag: async (req, res) => {
    if (!req.user.permissions.includes(5)) {
      console.error("You do not have permission to perform this action!");
      return res.status(403).send({
        error: "You do not have permission to perform this action!",
      });
    }
    console.log("User have permission to get live diagnostics");
    try {
      const result = await adminService.getDiagnostics();
      if (result === "No diagnostics exists!") {
        return res.status(404).send({
          error: result,
        });
      }
      res
        .status(200)
        .send({
          message: "Live Diagnostics fetched successfully!",
          diagnostics: result,
        });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  markLiveDiag: async (req, res) => {
    if (!req.user.permissions.includes(5)) {
      console.error("You do not have permission to perform this action!");
      return res.status(403).send({
        error: "You do not have permission to perform this action!",
      });
    }
    console.log("User have permission to mark live diagnostics");
    try {
      const result = await adminService.markDiagnostics(req.params.id);
      if (result === "Diagnostics not found") {
        return res.status(404).send({
          error: result,
        });
      }
      res.status(200).send({ message: "Diagnostics marked as read!" });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  // Function to add update file to the database     Done
  addUpdateFile: async (req, res) => {
    if (!req.user.permissions.includes(3)) {
      console.error("You do not have permission to perform this action!");
      return res.status(403).send({
        error: "You do not have permission to perform this action!",
      });
    }
    console.log("User have permission to add update file");
    try {
      const payload = {
        file: req.file,
        part: req.body.part,
        car: {
          maker: req.body.maker,
          model: req.body.model,
          year: req.body.year,
        },
      };
      // console.log(payload)
      const result = await adminService.addCarUpdate(payload);
      if (result === "Car not found") {
        return res.status(404).send({
          error: result,
        });
      }
      if (result === "No file uploaded.") {
        return res.status(400).send({
          error: result,
        });
      }
      res
        .status(200)
        .send({ message: "File uploaded Successfully", car: result });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send({ error: error.message });
    }
  },
  // Function to delete member from the database     Done
  deleteMember: async (req, res) => {
    if (req.user.role !== "admin")  {
      console.error("You do not have permission to perform this action!");
      return res.status(403).send({
        error: "You do not have permission to perform this action!",
      });
    }
    if (!req.user.permissions.includes(6)) {
      console.error("You do not have permission to perform this action!");
      return res.status(403).send({
        error: "You do not have permission to perform this action!",
      });
    }
    console.log("User have permission to delete member");
    if ( !req.body.email) {
      console.error("Email is required!");
      return res.status(400).send({
        error: "Email is required!",
      });
    }
    if (req.body.email === req.user.email) {
      console.error("You cannot delete yourself!");
      return res.status(403).send({
        error: "You cannot delete yourself!",
      });
    }
    try {
      const result = await adminService.deleteMember(req.body.email);
      if (result === "User not found") {
        return res.status(404).send({
          error: result,
        });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllMembers: async (req, res) => {
    if (!req.user.permissions.includes(6)) {
      console.error("You do not have permission to perform this action!");
      return res.status(403).send({
        error: "You do not have permission to perform this action!",
      });
    }
    console.log("User have permission to get all members");
    try {
      const result = await adminService.getAllMembers();
      if (result === "No Members found!") {
        return res.status(404).send({
          error: result,
        });
      }
      res.status(200).send({ message: "Users fetched successfully!", members: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getUserById: async (req, res) => {
    if (!req.user.permissions.includes(5)) {
      console.error("You do not have permission to perform this action!");
      return res.status(403).send({
        error: "You do not have permission to perform this action!",
      });
    }
    console.log("User have permission to get user by id");
    try {
      const result = await adminService.getUserById(req.params.id);
      if (result === "User not found") {
        return res.status(404).send({
          error: result,
        });
      }
      res.status(200).send({ message: "User fetched successfully!", user: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
};

module.exports = adminController;
