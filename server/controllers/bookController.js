const fs = require("fs");
const bookSch = require("../models/BookSch");
const userSch = require("../models/UserSch");
const httpStatus = require("http-status");
const path = require("path");
const bookController = {};

bookController.create = async (req, res) => {
  try {
    const me = await userSch.findOne({ username: req.data.username });
    if (!req.file) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: "No file uploaded".toUpperCase() });
    }
    const book = new bookSch({
      name: req.body.name,
      author: req.body.author,
      by_user: me,
      url: "/upload/" + req.namefile,
    });
    await book.save();
    me.books.push(book);
    await me.save();
    const dataRes = await book.populate({
      path: "by_user",
      select: "-password -access_token",
    });
    return res.status(httpStatus.CREATED).send({
      data: dataRes,
      message: "Added Success".toUpperCase(),
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "INTERNAL_SERVER_ERROR ".toUpperCase() + error.toString(),
    });
  }
};

bookController.getAll = async (req, res) => {
  const list_books = await bookSch.find({});
  if (list_books.length === 0) {
    return res
      .status(httpStatus.NO_CONTENT)
      .send({ message: "NOT FIND ANY BOOK".toUpperCase() });
  } else {
    return res.status(httpStatus.OK).send({
      data: list_books,
      message: "Get all book success".toUpperCase(),
    });
  }
};

bookController.getOne = async (req, res) => {
  try {
    const book_id = req.params.id;
    const book = await bookSch.findById(book_id);
    if (!book)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "NOT FOUND BOOK".toUpperCase() });
    return res
      .status(httpStatus.OK)
      .send({ data: book, message: "Get a Book Success".toUpperCase() });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message.toUpperCase() });
  }
};

bookController.update = async (req, res) => {
  try {
    const book_id = req.params.id;
    const book = await bookSch.findById(book_id);
    const me = await userSch.findOne({ username: req.data.username });
    if (!book)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "NOT FOUND BOOK".toUpperCase() });
    const { name, author } = req.body;
    if (!req.file) {
      if (!me._id.equals(book.by_user))
        return res
          .status(httpStatus.FORBIDDEN)
          .send({ message: "Access Dined" });
      book.name = name;
      book.author = author;
      await book.save();
    } else {
      if (!me._id.equals(book.by_user)) {
        fs.unlinkSync(
          path.join(process.cwd(), "public" + "/upload/" + req.namefile)
        );
        return res
          .status(httpStatus.FORBIDDEN)
          .send({ message: "Access Dined" });
      }
      book.name = name;
      book.author = author;
      const old_url = book.url;
      book.url = "/upload/" + req.namefile;
      await book.save();
      fs.unlinkSync(path.join(process.cwd(), "public" + old_url));
    }
    return res
      .status(httpStatus.OK)
      .send({ data: book, message: "Update Success".toUpperCase() });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: error.message.toUpperCase() });
  }
};

bookController.delete = async (req, res) => {
  try {
    const book_id = req.params.id;
    const book = await bookSch.findById(book_id);
    const me = await userSch.findOne({ username: req.data.username });
    if (!book)
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: "NOT FOUND BOOK".toUpperCase() });
    if (me._id.equals(book.by_user)) {
      const list_books = me.books.filter((value) => {
        return !value.equals(book._id);
      });
      me.books = list_books;
      await me.save();
      const url = book.url;
      await book.deleteOne();
      fs.unlinkSync(path.join(process.cwd(), "public" + url));
      return res
        .status(httpStatus.OK)
        .send({ message: "DELETE SUCCESS".toUpperCase() });
    }
    return res.status(httpStatus.FORBIDDEN).send({ message: "Access Dined" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "INTERNAL_SERVER_ERROR ".toUpperCase() + error.message,
    });
  }
};

module.exports = bookController;
