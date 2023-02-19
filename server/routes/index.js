const express = require("express");
const authRouter = require("./authRouter");
const userRouter = require("./userRouter");
const bookRouter = require("./bookRouter");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/book", bookRouter);
router.use("/user", userRouter);

module.exports = router;
