const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const userSch = require("../models/UserSch");
const generateAccessToken = require("../services/jwt");
const authController = {};

authController.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userSch.findOne({ username: username.toLowerCase() });
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
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "INTERNAL_SERVER_ERROR".toUpperCase() });
  }
};

authController.logout = async (req, res) => {
  try {
    const user = await userSch.findOne({ username: req.data.username });
    const array_access_token = user._doc.access_token.filter((value) => {
      return value !== req.token;
    });
    user.access_token = array_access_token;
    await user.save();
    return res
      .status(httpStatus.OK)
      .send({ message: "Logout Success".toUpperCase() });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.toString().toUpperCase() });
  }
};

authController.register = async (req, res) => {
  try {
    const { fullname, username, password } = req.body;
    const user = await userSch.findOne({ username: username.toLowerCase() });
    if (!user) {
      const salt = bcrypt.genSaltSync();
      const hashPassword = bcrypt.hashSync(password, salt);
      const payloadJWT = {
        fullname: fullname,
        username: username.toLowerCase(),
      };
      const access_token = generateAccessToken(payloadJWT);
      const newUser = new userSch({
        fullname: fullname,
        username: username.toLowerCase(),
        password: hashPassword,
        access_token: [access_token],
      });
      await newUser.save();
      return res.status(httpStatus.OK).send({
        data: { payloadJWT, access_token },
        message: "Register Success".toUpperCase(),
      });
    } else {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: "Account already exists".toUpperCase() });
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "INTERNAL_SERVER_ERROR ".toUpperCase() + error.toString(),
    });
  }
};

module.exports = authController;
