require("dotenv").config({ path: "./config.env" });
const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

// connecting to DB
connectDB();

// Instantiating Express App
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));

// Error handler should be the last piece of middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err, _promise) => {
  console.log(`Error occured: ${err.message}`);
  server.close(() => process.exit(1));
});
