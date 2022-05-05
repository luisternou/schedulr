const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required"],
    },

    email: {
      type: String,
      required: [true, "Please provide email address"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // CC BY-SA 4.0 https://stackoverflow.com/a/46181
        "An email is required",
      ],
    },
    password: {
      type: String,
      required: [true, "A password is required"],
      minlength: 6,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // this.resetPasswordToken = crypto
  //   .createHash("sha512")
  //   .update(resetToken)
  //   .digest("hex");

  this.resetPasswordToken = resetToken;
  let dateToExpire = Date.now() + 500 * (60 * 1000);
  let datenow = Date.now();
  this.resetPasswordExpire = dateToExpire;
  console.log("time to expire is " + dateToExpire);
  console.log("time now " + datenow);

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
