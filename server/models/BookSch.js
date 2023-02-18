const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BookSch = new schema({
  book_id: { type: schema.Types.ObjectId, required: true },
  name: { type: String, require: true, unique: true },
  added_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  author: { type: String },
  by_user: { type: schema.Types.ObjectId, ref: "user" },
  url: { type: String, unique: true, required: true },
});

module.exports = Book = mongoose.model("book", BookSch);
