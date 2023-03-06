const Account = require("../../model/Account");
const Transaction = require("../../model/Transaction");
const User = require("../../model/User");
const { appErr } = require("../../utils/appErr");

const createTransactionCtrl = async (req, res, next) => {
  const { name, transactionType, amount, category, notes, account } = req.body;
  try {
    //1. find the user
    const userFound = await User.findById(req.user);
    if (!userFound) {
      return next(appErr("User not found", 404));
    }
    //2. find the account
    const accountFound = await Account.findById(account);
    if (!accountFound) {
      return next(appErr("account not found", 404));
    }
    //3. create transaction
    const transaction = await Transaction.create({
      name,
      transactionType,
      amount,
      category,
      notes,
      createdBy: req.user,
    });
    //4. push the transaction to the account
    accountFound.transactions.push(transaction._id);
    //5. resave the account
    await accountFound.save();
    res.json({ status: "success", data: transaction });
  } catch (error) {
    return next(appErr(error), 500);
  }
};

const getTransactionsCtrl = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({ status: "success", data: transactions });
  } catch (error) {
    return next(appErr(error), 500);
  }
};

const getTransactionCtrl = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    res.status(200).json({ status: "success", data: transaction });
  } catch (error) {
    return next(appErr(error), 500);
  }
};

const deleteTransactionCtrl = async (req, res, next) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success", data: null });
  } catch (error) {
    return next(appErr(error), 500);
  }
};

const updateTransactionCtrl = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ status: "success", data: transaction });
  } catch (error) {
    return next(appErr(error), 500);
  }
};

module.exports = {
  createTransactionCtrl,
  getTransactionsCtrl,
  getTransactionCtrl,
  deleteTransactionCtrl,
  updateTransactionCtrl,
};
