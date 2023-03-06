const Account = require("../../model/Account");
const User = require("../../model/User");
const { appErr } = require("../../utils/appErr");

//create
const createAccountCtrl = async (req, res, next) => {
  const { name, initialBalance, accountType, notes } = req.body;
  try {
    //1. Find the logged in user
    const userFound = await User.findById(req.user);
    if (!userFound) {
      next(appErr("user not found", 404));
    }
    //2, Create the account
    const account = await Account.create({
      name,
      initialBalance,
      accountType,
      notes,
      createdBy: req.user,
    });
    //3. push the account into users account field
    userFound.accounts.push(account._id);
    userFound.hasCreatedAccount = true;
    //4. resave the user
    await userFound.save();
    res.json({ status: "success", data: account });
  } catch (error) {
    next(appErr(error), 500);
  }
};

//get accounts
const getAccountsCtrl = async (req, res, next) => {
  try {
    const accounts = await Account.find().populate({
      path: "transactions",
    });
    res.status(200).json({
      status: "success",
      data: accounts,
    });
  } catch (error) {
    next(appErr(error), 500);
  }
};

//get account
const getAccountCtrl = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id).populate(
      "transactions"
    );
    res.status(200).json({ status: "success", data: account });
  } catch (error) {
    next(appErr(error), 500);
  }
};

//delete
const deleteAccountCtrl = async (req, res, next) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success", data: null });
  } catch (error) {
    next(appErr(error), 500);
  }
};

//update
const updateAccountCtrl = async (req, res, next) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ status: "success", data: updatedAccount });
  } catch (error) {
    next(appErr(error), 500);
  }
};

module.exports = {
  createAccountCtrl,
  getAccountsCtrl,
  getAccountCtrl,
  deleteAccountCtrl,
  updateAccountCtrl,
};
