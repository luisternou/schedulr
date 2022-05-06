// create the routes for a crud api

const express = require("express");
const router = express.Router();

const {
  createController,
  getAllController,
  getByIDController,
  getByUserController,
  getCountController,
  getCountUserController,
  getNextMonthController,
  updateController,
  deleteController,
} = require("../controllers/shift.controller");

router.post("/new", createController);
router.get("/", getAllController);
router.get("/:id", getByIDController);
router.get("/user/:id", getByUserController);
router.get("/get/count", getCountController);
router.get("user/count/:id", getCountUserController);
router.get("/month/user/:id", getNextMonthController);
router.put("/:id", updateController);
router.delete("/:id", deleteController);

module.exports = router;
