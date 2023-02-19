const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSch = new schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  access_token: { type: [String], default: [] },
  books: { type: [schema.Types.ObjectId], default: [], ref: "book" },
});

module.exports = User = mongoose.model("user", UserSch);
