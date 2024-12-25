require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error-middleware");
const app = express();
const PORT = process.env.PORT || 8000;
const uri = process.env.URI;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/auth", authRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(uri);
    app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
