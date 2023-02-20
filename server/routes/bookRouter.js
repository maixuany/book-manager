const express = require("express");
const auth = require("../middlewares/auth");
const bookRouter = express.Router();
const { upload, handleUploadError } = require("../middlewares/upload");
const bookController = require("../controllers/bookController");

bookRouter.post("/", auth, upload.single("pdf"), bookController.create);
bookRouter.get("/", bookController.getAll);
bookRouter.get("/:id", bookController.getOne);
bookRouter.delete("/:id", auth, bookController.delete);
bookRouter.patch("/:id", auth, upload.single("pdf"), bookController.update);
bookRouter.use(handleUploadError);

module.exports = bookRouter;
