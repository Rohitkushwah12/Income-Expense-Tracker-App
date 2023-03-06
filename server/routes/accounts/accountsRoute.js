const express = require("express");
const {
  createAccountCtrl,
  getAccountsCtrl,
  getAccountCtrl,
  deleteAccountCtrl,
  updateAccountCtrl,
} = require("../../controllers/account/account");
const isLogin = require("../../middlewares/isLogin");

const accountsRoute = express.Router();

// POST/api/v1/accounts
accountsRoute.post("/", isLogin, createAccountCtrl);

// GET/api/v1/accounts
accountsRoute.get("/", getAccountsCtrl);

// GET/api/v1/accounts/:id
accountsRoute.get("/:id", getAccountCtrl);

// DELETE/api/v1/accounts/:id
accountsRoute.delete("/:id", deleteAccountCtrl);

// PUT/api/v1/accounts/:id
accountsRoute.put("/:id", updateAccountCtrl);

module.exports = accountsRoute;
