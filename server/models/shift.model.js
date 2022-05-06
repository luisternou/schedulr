const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: [true, "A User is required"],
    },
    date: {
      type: Date,

      required: [true, "A date is required"],
    },

    startTime: {
      type: String,
      required: [true, "A start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "An end time is required"],
    },

    duration: {
      type: String,
      required: [true, "A duration is required"],
    },
    description: {
      type: String,
      required: [true, "A description is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Shift = mongoose.model("Shift", ShiftSchema);

module.exports = Shift;
