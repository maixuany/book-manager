const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BookSch = new schema({
  name: { type: String, require: true, unique: true },
  added_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  author: { type: String },
  by_user: { type: schema.Types.ObjectId, ref: "user" },
  intro: { type: String },
  url: { type: String, unique: true, required: true },
});

module.exports = Book = mongoose.model("book", BookSch);
