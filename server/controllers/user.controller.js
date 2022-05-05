const User = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");
exports.registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({
    name,
    email,
    password,
  });
  await newUser.save();
  res.status(201).json({
    message: "User created successfully",
    data: newUser,
  });
};

exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  } else {
    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      const token = user.getSignedJwtToken();
      res.status(200).json({
        message: "User logged in successfully",
        token,
        user,
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
  }
};
exports.forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  } else {
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const message = `
            <p>You have requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${resetToken}">link</a> to reset your password</p>
            `;
    try {
      await sendEmail({
        to: user.email,
        subject: "Password reset token",
        text: message,
      });
      res.status(200).json({
        message: "Email sent successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Email could not be sent",
      });
    }
  }
};
exports.resetPasswordController = async (req, res) => {
  const { resetToken, password } = req.body;
  const user = await User.findOne({
    resetToken,
    resetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  } else {
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    res.status(200).json({
      message: "Password reset successfully",
    });
  }
};
exports.updateController = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  } else {
    user.name = name;
    user.email = email;
    user.password = password;
    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  }
};
exports.deleteController = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  } else {
    await user.remove();
    res.status(200).json({
      message: "User deleted successfully",
    });
  }
};
