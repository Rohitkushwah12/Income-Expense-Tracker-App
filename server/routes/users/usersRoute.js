const express = require("express");
const {
  registerCtrl,
  loginCtrl,
  profileCtrl,
  deleteCtrl,
  updateCtrl,
} = require("../../controllers/users/users");
const isLogin = require("../../middlewares/isLogin");

const usersRoute = express.Router();

// POST/api/v1/users/register
usersRoute.post("/register", registerCtrl);

// POST/api/v1//users/login
usersRoute.post("/login", loginCtrl);

// GET/api/v1/users/profile/:id
usersRoute.get("/profile", isLogin, profileCtrl);

// DELETE/api/v1//users/:id
usersRoute.delete("/", isLogin, deleteCtrl);

// PUT/api/v1//users/:id
usersRoute.put("/", isLogin, updateCtrl);

module.exports = usersRoute;
