const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const UserSch = require("../models/UserSch");

const auth = async (req, res, next) => {
  if (!req.header("Authorization"))
    return res
      .status(httpStatus.FORBIDDEN)
      .send({ message: "FORBIDDEN".toUpperCase() });
  const token = req.header("Authorization").replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserSch.findOne({ username: payload.username });
    if (!user || !user.access_token.includes(token))
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "User token does not exist".toUpperCase() });
    req.data = payload;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const expiredToken = token;
      const user = await UserSch.findOneAndUpdate(
        { access_token: token },
        { $pull: { access_token: token } },
        { new: true }
      );
      if (user) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({
            message: `Expired token ${expiredToken} has been removed from user ${user._id}`,
          });
      }
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message:
        "INTERNAL_SERVER_ERROR ".toUpperCase() + error.message.toUpperCase(),
    });
  }
};

module.exports = auth;
