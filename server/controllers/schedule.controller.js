const Schedule = require("../models/schedule.model");

exports.createController = async (req, res) => {
  const { userID, date, startTime, endTime, duration, description } = req.body;
  console.log(req.body);
  const newSchedule = new Schedule({
    userID,
    date,
    startTime,
    endTime,
    duration,
    description,
  });
  await newSchedule.save();
  res.status(201).json({
    message: "Schedule created successfully",
    data: newSchedule,
  });
};

exports.getAllController = async (req, res) => {
  const schedules = await Schedule.find();
  res.status(200).json({
    message: "Schedules fetched successfully",
    data: schedules,
  });
};

exports.getByIDController = async (req, res) => {
  const { id } = req.params;
  const schedule = await Schedule.findById(id);
  res.status(200).json({
    message: "Schedule fetched successfully",
    data: schedule,
  });
};

exports.getByUserController = async (req, res) => {
  const { id } = req.params;
  const schedule = await Schedule.find({ userID: id });
  res.status(200).json({
    message: "Schedule fetched successfully",
    data: schedule,
  });
};

exports.getCountController = async (req, res) => {
  const count = await Schedule.countDocuments();
  res.status(200).json({
    message: "Schedule count fetched successfully",
    data: count,
  });
};

exports.getCountUserController = async (req, res) => {
  const { id } = req.params;
  const count = await Schedule.countDocuments({ userID: id });
  res.status(200).json({
    message: "Schedule count fetched successfully",
    data: count,
  });
};

exports.getNextMonthController = async (req, res) => {
  // get all schedules for the user that have a date in the next month
  const { id } = req.params;
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const schedule = await Schedule.find({
    userID: id,
    date: { $gte: nextMonth },
  });
  res.status(200).json({
    message: "Schedule fetched successfully",
    data: schedule,
  });
};

exports.updateController = async (req, res) => {
  const { id } = req.params;
  const { userID, date, startTime, endTime, duration, description } = req.body;
  const updatedSchedule = await Schedule.findByIdAndUpdate(id, {
    userID,
    date,
    startTime,
    endTime,
    duration,
    description,
  });
  res.status(200).json({
    message: "Schedule updated successfully",
    data: updatedSchedule,
  });
};

exports.deleteController = async (req, res) => {
  const { id } = req.params;
  const deletedSchedule = await Schedule.findByIdAndDelete(id);
  res.status(200).json({
    message: "Schedule deleted successfully",
    data: deletedSchedule,
  });
};
