const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const userSch = require("../models/UserSch");
const generateAccessToken = require("../services/jwt");
const authController = {};

authController.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userSch.findOne({ username: username });
  if (!user)
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ message: "Username is not registered".toUpperCase() });
  else {
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid)
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Incorrect password".toUpperCase() });
    else {
      const { _id, password, books, access_token, ...payload } = user._doc;
      const token = generateAccessToken(payload);
      user.access_token.push(token);
      await user.save();
      return res.status(httpStatus.OK).send({
        data: { payload, token },
        message: "Login Success".toUpperCase(),
      });
    }
  }
};

authController.logout = async (req, res) => {};

authController.register = async (req, res) => {};

module.exports = authController;
