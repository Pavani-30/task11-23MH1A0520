const express = require("express");
const connectDB = require("./config/db");
const rateLimiter = require("./middlewares/rateLimiter");
const seedProducts = require("./services/seedService");

const productRoutes = require("./routes/productRoutes");

require("dotenv").config();

const app = express();

if (process.env.NODE_ENV !== "test") {
  connectDB();
}
connectDB().then(() => {
  seedProducts();
});

app.use(express.json());
app.use(rateLimiter);

app.use("/api/products", productRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

module.exports = app;