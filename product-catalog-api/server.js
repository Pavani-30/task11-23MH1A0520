const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");


const app = express();

app.use(express.json());

app.post("/test", (req, res) => {
  res.json({ message: "POST working" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy"
  });
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect("mongodb://mongo:27017/productdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

