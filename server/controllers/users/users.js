const bcrypt = require("bcryptjs");
const User = require("../../model/User");
const { appErr } = require("../../utils/appErr");
const generateToken = require("../../utils/generateToken");

// Register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  try {
    //check email exist
    const userFound = await User.findOne({ email });
    if (userFound) {
      next(appErr("User Already Exist", 400));
    }

    //check if fields are empty
    if (!email || !password || !fullname) {
      return next(appErr("Please provide all fields"));
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    res.json({
      status: "Success",
      fullname: user.fullname,
      email: user.email,
      id: user._id,
    });
  } catch (error) {
    return next(appErr(error, 500));
  }
};

// Login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //check if email exist
    const userFound = await User.findOne({ email });
    if (!userFound) return next(appErr("Invalid login credentials", 400));

    //check for password validity
    const isPasswordMatch = await bcrypt.compare(password, userFound.password);
    if (!isPasswordMatch) return next(appErr("Invalid login credentials", 400));

    res.json({
      status: "success",
      data: userFound,
      token: generateToken(userFound._id),
    });
  } catch (error) {
    return next(appErr(error, 500));
  }
};

// Profile
const profileCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).populate({
      path: "accounts",
      populate: {
        path: "transactions",
        model: "Transaction",
      },
    });
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return next(appErr(error, 500));
  }
};

// Delete
const deleteCtrl = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(appErr(error, 500));
  }
};

// Update
const updateCtrl = async (req, res, next) => {
  try {
    //1. check if email is taken
    if (req.body.email) {
      const userFound = await User.findOne({ email: req.body.email });
      if (userFound) {
        return next(
          appErr("Email is taken or you already have this email", 400)
        );
      }
    }
    //2. check if user is updating password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // update the user
      const user = await User.findByIdAndUpdate(
        req.user,
        {
          password: hashedPassword,
          fullname: req.body.fullname,
          email: req.body.email,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      // send the response
      res.status(200).json({
        status: "success",
        data: user,
      });
    }
    // update the user
    const updatedUser = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
      runValidators: true,
    });
    // send the response
    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    return next(appErr(error, 500));
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  deleteCtrl,
  updateCtrl,
};
