const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const requestIp = require("request-ip");
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

app.use(function (req, res, next) {
  req.client_ip_address = requestIp.getClientIp(req);
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT, PATCH");
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
