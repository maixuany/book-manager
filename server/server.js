const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const router = require("./routes/index");
const connectDB = require("./services/mongodb");

const PORT = process.env.PORT || 8080;

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
