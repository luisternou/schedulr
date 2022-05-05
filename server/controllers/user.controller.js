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

exports.getAllController = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    message: "Users fetched successfully",
    data: users,
  });
};
exports.getByIDController = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json({
    message: "User fetched successfully",
    data: user,
  });
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
exports.resetPasswordController = async (req, res, next) => {
  // const resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(req.params.resetToken)
  //   .digest("hex");

  const resetPasswordToken = req.params.resetToken;

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      message: "Password was updated successfully",
      token: user.getSignedJwtToken(),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateController = async (req, res, next) => {
  const { name, role, email, password } = req.body;
  let id = req.params.id;
  try {
    User.findOne({ _id: id }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "No User found found",
        });
      }
      if (!name) {
        user.name = user.name;
      } else {
        user.name = name;
      }
      if (!email) {
        user.email = user.email;
      } else {
        user.email = email;
      }

      if (!password) {
        user.password = user.password;
      } else {
        user.password = password;
      }

      user.save((err, updatedUser) => {
        if (err) {
          console.log("User UPDATE ERROR", err);
          return res.status(400).json({
            error: "User update failed",
          });
        }
        res.json(updatedUser);
      });
    });
  } catch (err) {
    console.error("Update Controller not working");
    next(err);
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
