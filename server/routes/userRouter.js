const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.get("/me", auth, userController.getme);
userRouter.patch("/change_pass", auth, userController.changePassword);
userRouter.patch("/change_info", auth, userController.edit);

module.exports = userRouter;
