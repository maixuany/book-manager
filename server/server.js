const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const router = require("./routes/index");
const connectDB = require("./services/mongodb");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors({ credentials: true, origin: "http://127.0.0.1:3001" }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", router);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
