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
  updateController,
  deleteController,
} = require("../controllers/schedule.controller");

router.post("/new", createController);
router.get("/", getAllController);
router.get("/:id", getByIDController);
router.get("/user/:id", getByUserController);
router.get("/get/count", getCountController);
router.get("user/count/:id", getCountUserController);
router.put("/:id", updateController);
router.delete("/:id", deleteController);

module.exports = router;
