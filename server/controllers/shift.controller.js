const Shift = require("../models/shift.model");

exports.createController = async (req, res) => {
  const { userID, date, startTime, endTime, duration, description } = req.body;
  console.log(req.body);
  const newShift = new Shift({
    userID,
    date,
    startTime,
    endTime,
    duration,
    description,
  });
  await newShift.save();
  res.status(201).json({
    message: "Shift created successfully",
    data: newShift,
  });
};

exports.getAllController = async (req, res) => {
  // get all shifts and sort them by date
  const shifts = await Shift.find();
  // sort shifts by date
  const sortedShifts = shifts.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  });

  res.status(200).json({
    message: "Shifts fetched successfully",
    data: sortedShifts,
  });
};

exports.getByIDController = async (req, res) => {
  const { id } = req.params;
  const shift = await Shift.findById(id);
  res.status(200).json({
    message: "Shift fetched successfully",
    data: shift,
  });
};

exports.getByUserController = async (req, res) => {
  const { id } = req.params;
  const shift = await Shift.find({ userID: id });
  res.status(200).json({
    message: "Shift fetched successfully",
    data: shift,
  });
};

exports.getCountController = async (req, res) => {
  const count = await Shift.countDocuments();
  res.status(200).json({
    message: "Shift count fetched successfully",
    data: count,
  });
};

exports.getCountUserController = async (req, res) => {
  const { id } = req.params;
  const count = await Shift.countDocuments({ userID: id });
  res.status(200).json({
    message: "Shift count fetched successfully",
    data: count,
  });
};

exports.getNextMonthController = async (req, res) => {
  // get all shifts for the user that have a date in the next month
  const { id } = req.params;
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const shift = await Shift.find({
    userID: id,
    date: { $gte: nextMonth },
  });
  res.status(200).json({
    message: "Shift fetched successfully",
    data: shift,
  });
};

exports.updateController = async (req, res) => {
  const { id } = req.params;
  const { userID, date, startTime, endTime, duration, description } = req.body;
  const updatedShift = await Shift.findByIdAndUpdate(id, {
    userID,
    date,
    startTime,
    endTime,
    duration,
    description,
  });
  res.status(200).json({
    message: "Shift updated successfully",
    data: updatedShift,
  });
};

exports.deleteController = async (req, res) => {
  const { id } = req.params;
  const deletedShift = await Shift.findByIdAndDelete(id);
  res.status(200).json({
    message: "Shift deleted successfully",
    data: deletedShift,
  });
};
