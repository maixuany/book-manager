const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.get("/me", auth, userController.getme);

module.exports = userRouter;
