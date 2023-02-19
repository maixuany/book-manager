const express = require("express");
const auth = require("../middlewares/auth");
const authRouter = express.Router();
const authController = require("../controllers/authController");

authRouter.post("/login", authController.login);
authRouter.post("/logout", auth, authController.logout);

authRouter.post("/register", authController.register);

module.exports = authRouter;
