const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const userSch = require("../models/UserSch");
const userController = {};

userController.getme = async (req, res) => {
  try {
    const me = await userSch.findOne({ username: req.data.username });
    if (!me)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "not found user".toUpperCase() });
    const { password, access_token, ...dataRes } = me._doc;
    return res
      .status(httpStatus.OK)
      .send({ data: dataRes, message: "get data success".toUpperCase() });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message.toUpperCase() });
  }
};

userController.edit = async (req, res) => {
  try {
    const { fullname, username } = req.data;
    const me = await userSch.findOne({ username: username });
    const new_fullname = req.body.fullname;
    me.fullname = new_fullname;
    await me.save();
    const { _id, password, access_token, ...dataRes } = me._doc;
    return res
      .status(httpStatus.OK)
      .send({ data: dataRes, message: "changed success".toUpperCase() });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "INTERNAL_SERVER_ERROR ".toUpperCase() + error.toString(),
    });
  }
};

userController.changePassword = async (req, res) => {
  try {
    const { fullname, username } = req.data;
    const me = await userSch.findOne({ username: username });
    const { oldPassword, newPassword } = req.body;
    if (!bcrypt.compareSync(oldPassword, me.password)) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send({ message: "Wrong password".toUpperCase() });
    } else {
      const salt = bcrypt.genSaltSync();
      const hashPassword = bcrypt.hashSync(newPassword, salt);
      me.password = hashPassword;
      me.save();
      return res
        .status(httpStatus.OK)
        .send({ data: dataRes, message: "changed success".toUpperCase() });
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "INTERNAL_SERVER_ERROR ".toUpperCase() + error.toString(),
    });
  }
};

module.exports = userController;
