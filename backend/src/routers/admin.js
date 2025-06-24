const express = require("express");
// const userServices = require("../services/admin")
const auth = require("../middleware/auth");
const multer = require("multer");
const bodyParser = require("body-parser");
const router = new express.Router();
const adminController = require("../controllers/admin");

router.use(bodyParser.urlencoded({ extended: true }));

// //                            Admin

//                    Create Admin
router.post("/admin/createAdmin", auth, adminController.createAdmin);

//                    Get All Admins
router.get("/admin/getAllAdmins", auth, adminController.getAllAdmins);

//                    Edit Admin
router.patch("/admin/editAdmin", auth, adminController.editAdmin);

//                    Delete Admin
router.delete("/admin/deleteAdmin/:id", auth, adminController.deleteAdmin);

//                    Get All Driving Licenses
router.get(
  "/admin/getAllDrivingLicenses",
  auth,
  adminController.getAllDrivingLicenses
);

//                    Need to fix the Create user in the user router
//                    Add Driving License
router.post(
  "/admin/addDrivingLicense",
  auth,
  adminController.addDrivingLicense
);

//                    Get All Car Licenses
router.get("/admin/getAllCarLicenses", auth, adminController.getAllCarLicenses);

//                    Check Vehicle License
router.post("/admin/checkVehicleLicense", auth, adminController.checkCarExists);

//                    Edit Driving License
router.patch(
  "/admin/updateDrivingLicense/:id",
  auth,
  adminController.editDrivingLicense
);

//                    Delete Driving License
router.delete(
  "/admin/deleteDrivingLicense/:id",
  auth,
  adminController.deleteDrivingLicense
);

//                    Add Car License
router.post("/admin/addCarLicense", auth, adminController.addCarLicense);

//                    Edit Car License
router.patch(
  "/admin/updateCarLicense/:id",
  auth,
  adminController.editCarLicense
);

//                    Delete Car License
router.delete(
  "/admin/deleteCarLicense/:id",
  auth,
  adminController.deleteCarLicense
);

//                    Get All Courses requested by users
router.get("/admin/getAllCourses", auth, adminController.getAllCourses);

//                    Approve Course
router.post("/admin/approveCourse/:id", auth, adminController.approveCourse);

//                    Decline Course
router.post("/admin/declineCourse/:id", auth, adminController.declineCourse);

//                    Get All Courses requested by users
router.get(
  "/admin/getAllExamRequests",
  auth,
  adminController.getAllExamRequests
);

//                    Approve Course
router.post(
  "/admin/approveExamRequest/:id",
  auth,
  adminController.approveExamRequest
);

//                    Decline Course
router.post(
  "/admin/declineExamRequest/:id",
  auth,
  adminController.declineExamRequest
);

//                    Get All Exam Dates
router.get("/admin/getAllExamDates", auth, adminController.getAllExamDates);

//                    Get All Practical Exam Requests
router.get(
  "/admin/getAllPracticalExamRequests",
  auth,
  adminController.getAllPracticalExamRequests
);

//                    Approve Practical Exam Request
router.post(
  "/admin/approvePracticalExamRequest/:id",
  auth,
  adminController.approvePracticalExamRequest
);

//                    Decline Practical Exam Request
router.post(
  "/admin/declinePracticalExamRequest/:id",
  auth,
  adminController.declinePracticalExamRequest
);

//                    Schedule Exam Date for Non Created Users
router.post(
  "/admin/scheduleExamDateForNonCreatedUsers",
  auth,
  adminController.scheduleExamDateForNonCreatedUsers
);

//                    Add Traffic Violations
router.post(
  "/admin/addTrafficViolation",
  auth,
  adminController.addTrafficViolation
);

//                   Get All Traffic Violations
router.get(
  "/admin/getAllTrafficViolations",
  auth,
  adminController.getAllTrafficViolations
);

//                   Update Traffic Violation
router.patch(
  "/admin/updateTrafficViolation/:id",
  auth,
  adminController.updateTrafficViolation
);

//                   Delete Traffic Violation
router.delete(
  "/admin/deleteTrafficViolation/:id",
  auth,
  adminController.deleteTrafficViolation
);

//                   Get All License Requests
router.get(
  "/admin/license-requests",
  auth,
  adminController.getAllLicenseRequests
);

//          Complete License Request
router.post(
  "/admin/request-complete/:id",
  auth,
  adminController.completeLicenseRequest
);

//                   Approve License Requests
router.post(
  "/admin/license-requests/approve",
  auth,
  adminController.approveLicenseRequests
);

//                   Reject License Request
router.post(
  "/admin/license-requests/reject",
  auth,
  adminController.rejectLicenseRequest
);

//                  Get All PendingApproval payment requests
router.get(
  "/admin/getAllPendingApprovalPaymentRequests",
  auth,
  adminController.getAllPendingApprovalPaymentRequests
);

//                  Approve Payment Request
router.post(
  "/admin/approvePaymentRequests",
  auth,
  adminController.approvePaymentRequest
);

//                  Decline Request
router.post(
  "/admin/rejectRequest",
  auth,
  adminController.declineRequest
);

//                  Decline Payment Request
router.post(
  "/admin/rejectPaymentRequest",
  auth,
  adminController.declinePaymentRequest
);

//                  Get All New Vehicle Requests
router.get(
  "/admin/getAllNewVehicleRequests",
  auth,
  adminController.getAllNewVehicleRequests
);

//                  Approve New Vehicle Request
router.post(
  "/admin/approveLicense/:id",
  auth,
  adminController.approveNewVehicleRequest
);

//                  Decline New Vehicle Request
router.post(
  "/admin/declineLicense/:id",
  auth,
  adminController.declineNewVehicleRequest
);
// const uploadNewsImage = multer({
//   limits: {
//     fileSize: 4000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
//       return cb(new Error("Please upload an Image file"));
//     }
//     cb(undefined, true);
//   },
// });
// router.post("/admin/news",uploadNewsImage.single("image"),auth ,adminController.addNews);

// //                    ADD Member
// router.post("/admin/members",auth,adminController.addMember);

// //                      Get Live Diagnostics
// router.get("/admin/live_diag", auth, adminController.getLiveDiag);

// //                     Mark Live Diagnostics as read
// router.patch("/admin/live_diag/:id", auth, adminController.markLiveDiag);

// //                      Delete Member
// router.delete("/admin/members", auth, adminController.deleteMember);

// //                    Get All Members
// router.get("/admin/members", auth, adminController.getAllMembers);

// //                    Get User By ID
// router.get("/admin/user/:id", auth, adminController.getUserById);

//     // Function to upload Hex Files
//     const uploadHexFile = multer({
//       limits: {
//         fileSize: 5000000,
//       },
//       fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(hex)$/)) {
//           cb(new Error("Please upload an Hex file"));
//         } else {
//           cb(null, true);
//         }
//       },
//       });

// router.post("/admin/upload", auth,  uploadHexFile.single("hex"), adminController.addUpdateFile);

module.exports = router;
