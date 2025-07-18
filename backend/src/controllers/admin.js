const adminService = require("../services/admin");
// const NotFoundError = require('../errors/NotFoundError');
// const ValidationError = require('../errors/ValidationError');
// const ConflictError = require('../errors/ConflictError');

const adminController = {
  createAdmin: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: "admin",
      };
      const result = await adminService.createAdmin(payload);
      if (
        result === "All fields are required!" ||
        result === "Password must be at least 8 characters!" ||
        result === "Failed to create user!" ||
        result === "Role does not exist!"
      ) {
        // throw new ValidationError(result);
        return res.status(400).send({
          error: result,
        });
      }
      res
        .status(201)
        .send({ message: "Admin Created successful!", user: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllAdmins: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllAdmins(req.user);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  editAdmin: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.editAdmin(req.user, req.body);
      if (result === "Admin not found") {
        return res.status(404).send({ error: "Admin not found" });
      }
      if (
        result === "Failed to update admin!" ||
        result === "No fields to edit"
      ) {
        return res.status(400).send({ error: "Failed to update admin!" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  deleteAdmin: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.deleteAdmin(req.params.id);
      if (result === "Admin not found") {
        return res.status(404).send({ error: "Admin not found" });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllDrivingLicenses: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllDrivingLicenses();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  addDrivingLicense: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.addDrivingLicense(req.body);
      if (result === "Driving license already exists") {
        return res
          .status(400)
          .send({ error: "Driving license already exists" });
      }
      res
        .status(200)
        .send({ message: "Driving license added successfully", result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllCarLicenses: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllCarLicenses();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  checkCarExists: async (req, res) => {
    try {
      console.log(req.body);
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.checkCarExists(req.body);
      if (result === "Car already exists") {
        return res.status(400).send({ error: "Car already exists" });
      }
      res.status(200).send({ message: "Car Not Exist", result });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
  editDrivingLicense: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.editDrivingLicense(
        req.params.id,
        req.body
      );
      if (result === "Driving license not found") {
        return res.status(404).send({ error: "Driving license not found" });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  deleteDrivingLicense: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.deleteDrivingLicense(req.params.id);
      if (result === "Driving license not found") {
        return res.status(404).send({ error: "Driving license not found" });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  addCarLicense: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.addCarLicense(req.body.carLicense);
      // if (result === "Car license already exists") {
      //   return res.status(400).send({ error: "Car license already exists" });
      // }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  editCarLicense: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.editCarLicense(req.params.id, req.body);
      if (result === "Car license not found") {
        return res.status(404).send({ error: "Car license not found" });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  deleteCarLicense: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.deleteCarLicense(req.params.id);
      if (result === "Car license not found") {
        return res.status(404).send({ error: "Car license not found" });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllCourses: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllCourses();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  approveCourse: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.approveCourse(req.params.id);
      if (result === "Course not found") {
        return res.status(404).send({ error: "Course not found" });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  declineCourse: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.declineCourse(req.params.id);
      if (result === "Course not found") {
        return res.status(404).send({ error: "Course not found" });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllExamRequests: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllExamRequests();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  approveExamRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.approveExamRequest(req.params.id);
      if (result === "Exam request not found") {
        return res.status(404).send({ error: "Exam request not found" });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  declineExamRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.declineExamRequest(req.params.id);
      if (result === "Exam request not found") {
        return res.status(404).send({ error: "Exam request not found" });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllExamDates: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllExamDates();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllPracticalExamRequests: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllPracticalExamRequests();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  approvePracticalExamRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.approvePracticalExamRequest(
        req.params.id,
        req.body
      );
      if (result === "Practical exam request not found") {
        return res
          .status(404)
          .send({ error: "Practical exam request not found" });
      }
      res
        .status(200)
        .send({ message: "Practical exam request approved", result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  declinePracticalExamRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.declinePracticalExamRequest(
        req.params.id
      );
      if (result === "Practical exam request not found") {
        return res
          .status(404)
          .send({ error: "Practical exam request not found" });
      }
      res.status(200).send({ message: result });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  scheduleExamDateForNonCreatedUsers: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.scheduleExamDateForNonCreatedUsers(
        req.body
      );
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  addTrafficViolation: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.addTrafficViolation(req.body);
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllTrafficViolations: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllTrafficViolations();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  updateTrafficViolation: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.updateTrafficViolation(
        req.params.id,
        req.body
      );
      if (result === "Traffic violation not found") {
        return res.status(404).send({ error: "Traffic violation not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  deleteTrafficViolation: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.deleteTrafficViolation(req.params.id);
      if (result === "Traffic violation not found") {
        return res.status(404).send({ error: "Traffic violation not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllLicenseRequests: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllLicenseRequests();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  completeLicenseRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.completeLicenseRequest(req.params.id);
      if (result === "License request not found") {
        return res.status(404).send({ error: "License request not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  approveLicenseRequests: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.approveLicenseRequests(req.body);
      if (result === "License request not found") {
        return res.status(404).send({ error: "License request not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  rejectLicenseRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.rejectLicenseRequest(req.body);
      if (result === "License request not found") {
        return res.status(404).send({ error: "License request not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllPendingApprovalPaymentRequests: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllPendingApprovalPaymentRequests();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  approvePaymentRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.approvePaymentRequest(req.body);
      if (result === "Payment request not found") {
        return res.status(404).send({ error: "Payment request not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  declineRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.declineRequest(req.body);
      if (result === "Payment request not found") {
        return res.status(404).send({ error: "Payment request not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  declinePaymentRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.declinePaymentRequest(req.body);
      if (result === "Payment request not found") {
        return res.status(404).send({ error: "Payment request not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  getAllNewVehicleRequests: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.getAllNewVehicleRequests();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  approveNewVehicleRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.approveNewVehicleRequest(req.params.id);
      if (result === "New vehicle request not found") {
        return res.status(404).send({ error: "New vehicle request not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  declineNewVehicleRequest: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not an admin" });
      }
      const result = await adminService.declineNewVehicleRequest(req.params.id);
      if (result === "New vehicle request not found") {
        return res.status(404).send({ error: "New vehicle request not found" });
      }
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  // Function to add news to the database         Done
  // addNews: async (req, res) => {
  //   try {
  //     if (!req.user.permissions.includes(4)) {
  //       console.error("You do not have permission to perform this action!");
  //       return res.status(403).send({
  //         error: "You do not have permission to perform this action!",
  //       });
  //     }

  //     console.log("User have permission to add news");
  //     payload = {
  //       news: req.body.news,
  //       image: req.file,
  //     };
  //     // console.log(payload);
  //     const result = await adminService.addNews(payload);
  //     if (
  //       result === "All fields are required!" ||
  //       result === "No image uploaded."
  //     ) {
  //       return res.status(400).send({
  //         error: result,
  //       });
  //     }
  //     res
  //       .status(201)
  //       .send({ message: "News Created successful!", news: result });
  //   } catch (error) {
  //     res.status(400).send({ error: error.message });
  //   }
  // },
  // // Function to add member to the database       Done
  // addMember: async (req, res) => {
  //   if (!req.user.permissions.includes(1)) {
  //     console.error("You do not have permission to perform this action!");
  //     return res.status(403).send({
  //       error: "You do not have permission to perform this action!",
  //     });
  //   }
  //   console.log("User have permission to add member");
  //   try {
  //     const payload = {
  //       name: req.body.name,
  //       email: req.body.email,
  //       password: req.body.password,
  //       role: req.body.role,
  //       permission: req.body.permissions,
  //     };

  //     const result = await adminService.addMember(payload);

  //     if (
  //       result === "All fields are required!" ||
  //       result === "Password must be at least 8 characters!" ||
  //       result === "Failed to create user!" ||
  //       result === "Permission is required!" ||
  //       result === "Role does not exist!"
  //     ) {
  //       // throw new ValidationError(result);
  //       return res.status(400).send({
  //         error: result,
  //       });
  //     }
  //     if (result === "Account Already Exist") {
  //       return res.status(409).send({
  //         error: result,
  //       });
  //     }
  //     return res
  //       .status(201)
  //       .send({ message: "User Created successful!", user: result });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(400).send({ error: error.message });
  //   }
  // },
  // // Function to get all members from the database     Done
  // getLiveDiag: async (req, res) => {
  //   if (!req.user.permissions.includes(5)) {
  //     console.error("You do not have permission to perform this action!");
  //     return res.status(403).send({
  //       error: "You do not have permission to perform this action!",
  //     });
  //   }
  //   console.log("User have permission to get live diagnostics");
  //   try {
  //     const result = await adminService.getDiagnostics();
  //     if (result === "No diagnostics exists!") {
  //       return res.status(404).send({
  //         error: result,
  //       });
  //     }
  //     res
  //       .status(200)
  //       .send({
  //         message: "Live Diagnostics fetched successfully!",
  //         diagnostics: result,
  //       });
  //   } catch (error) {
  //     res.status(400).send(error.message);
  //   }
  // },
  // markLiveDiag: async (req, res) => {
  //   if (!req.user.permissions.includes(5)) {
  //     console.error("You do not have permission to perform this action!");
  //     return res.status(403).send({
  //       error: "You do not have permission to perform this action!",
  //     });
  //   }
  //   console.log("User have permission to mark live diagnostics");
  //   try {
  //     const result = await adminService.markDiagnostics(req.params.id);
  //     if (result === "Diagnostics not found") {
  //       return res.status(404).send({
  //         error: result,
  //       });
  //     }
  //     res.status(200).send({ message: "Diagnostics marked as read!" });
  //   } catch (error) {
  //     res.status(400).send({ error: error.message });
  //   }
  // },
  // // Function to add update file to the database     Done
  // addUpdateFile: async (req, res) => {
  //   if (!req.user.permissions.includes(3)) {
  //     console.error("You do not have permission to perform this action!");
  //     return res.status(403).send({
  //       error: "You do not have permission to perform this action!",
  //     });
  //   }
  //   console.log("User have permission to add update file");
  //   try {
  //     const payload = {
  //       file: req.file,
  //       part: req.body.part,
  //       car: {
  //         maker: req.body.maker,
  //         model: req.body.model,
  //         year: req.body.year,
  //       },
  //     };
  //     // console.log(payload)
  //     const result = await adminService.addCarUpdate(payload);
  //     if (result === "Car not found") {
  //       return res.status(404).send({
  //         error: result,
  //       });
  //     }
  //     if (result === "No file uploaded.") {
  //       return res.status(400).send({
  //         error: result,
  //       });
  //     }
  //     res
  //       .status(200)
  //       .send({ message: "File uploaded Successfully", car: result });
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     res.status(500).send({ error: error.message });
  //   }
  // },
  // // Function to delete member from the database     Done
  // deleteMember: async (req, res) => {
  //   if (req.user.role !== "admin")  {
  //     console.error("You do not have permission to perform this action!");
  //     return res.status(403).send({
  //       error: "You do not have permission to perform this action!",
  //     });
  //   }
  //   if (!req.user.permissions.includes(6)) {
  //     console.error("You do not have permission to perform this action!");
  //     return res.status(403).send({
  //       error: "You do not have permission to perform this action!",
  //     });
  //   }
  //   console.log("User have permission to delete member");
  //   if ( !req.body.email) {
  //     console.error("Email is required!");
  //     return res.status(400).send({
  //       error: "Email is required!",
  //     });
  //   }
  //   if (req.body.email === req.user.email) {
  //     console.error("You cannot delete yourself!");
  //     return res.status(403).send({
  //       error: "You cannot delete yourself!",
  //     });
  //   }
  //   try {
  //     const result = await adminService.deleteMember(req.body.email);
  //     if (result === "User not found") {
  //       return res.status(404).send({
  //         error: result,
  //       });
  //     }
  //     res.status(200).send({ message: result });
  //   } catch (error) {
  //     res.status(400).send({ error: error.message });
  //   }
  // },
  // getAllMembers: async (req, res) => {
  //   if (!req.user.permissions.includes(6)) {
  //     console.error("You do not have permission to perform this action!");
  //     return res.status(403).send({
  //       error: "You do not have permission to perform this action!",
  //     });
  //   }
  //   console.log("User have permission to get all members");
  //   try {
  //     const result = await adminService.getAllMembers();
  //     if (result === "No Members found!") {
  //       return res.status(404).send({
  //         error: result,
  //       });
  //     }
  //     res.status(200).send({ message: "Users fetched successfully!", members: result });
  //   } catch (error) {
  //     res.status(400).send({ error: error.message });
  //   }
  // },
  // getUserById: async (req, res) => {
  //   if (!req.user.permissions.includes(5)) {
  //     console.error("You do not have permission to perform this action!");
  //     return res.status(403).send({
  //       error: "You do not have permission to perform this action!",
  //     });
  //   }
  //   console.log("User have permission to get user by id");
  //   try {
  //     const result = await adminService.getUserById(req.params.id);
  //     if (result === "User not found") {
  //       return res.status(404).send({
  //         error: result,
  //       });
  //     }
  //     res.status(200).send({ message: "User fetched successfully!", user: result });
  //   } catch (error) {
  //     res.status(400).send({ error: error.message });
  //   }
  // }
};

module.exports = adminController;
