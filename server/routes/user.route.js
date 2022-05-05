const express = require("express");
const router = express.Router();

const {
  loginController,
  registerController,
  getAllController,
  getByIDController,
  updateController,
  deleteController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/user.controller");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/", getAllController);
router.get("/id/:id", getByIDController);
router.put("/update/:id", updateController);
router.delete("/delete/:id", deleteController);

router.post("/forgotpassword", forgotPasswordController);
router.put("/passwordreset/:resetToken", resetPasswordController);

module.exports = router;
