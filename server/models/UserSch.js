const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSch = new schema({
  user_id: { type: schema.Types.ObjectId, required: true },
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  access_token: { type: [String] },
  books: { type: [schema.Types.ObjectId], ref: "book" },
});

module.exports = User = mongoose.model("user", UserSch);
