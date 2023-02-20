const path = require("path");
const fs = require("fs");
const multer = require("multer");
const httpStatus = require("http-status");

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(httpStatus.BAD_REQUEST).json({ message: err.message });
  } else {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid file upload.".toUpperCase() });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);
    const safename = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    let i = 0;
    const generateName = () => {
      const newName = 1 === 0 ? safename + ext : safename + "-" + i + ext;
      if (fs.existsSync("public/upload/" + newName)) {
        i++;
        generateName();
      } else {
        req.namefile = newName;
        cb(null, newName);
      }
    };
    generateName();
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error());
    }
    cb(null, true);
  },
});

module.exports = { upload, handleUploadError };
