const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/api.route");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const { MONGODB_URL, PORT } = process.env;

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173", "https://frontend-1il6.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
    credentials: true,
  })
);

app.options("*", cors());

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((error) => console.error(error));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use("/", router);