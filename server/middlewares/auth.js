const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const UserSch = require("../models/UserSch");

const auth = async (req, res, next) => {
  if (!req.header("Authorization"))
    return res
      .status(httpStatus.FORBIDDEN)
      .send({ message: "FORBIDDEN".toUpperCase() });
  const token = req.header("Authorization").replace("Bearer ", "");
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  try {
    const user = await UserSch.findOne({ username: payload.username });
    if (!user || !user.access_token.includes(token))
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "User token does not exist".toUpperCase() });
    req.data = payload;
    next();
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "INTERNAL_SERVER_ERROR".toUpperCase() });
  }
};

module.exports = auth;
