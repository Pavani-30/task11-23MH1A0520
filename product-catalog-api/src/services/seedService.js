const Product = require("../models/Product");

const seedProducts = async () => {
  const count = await Product.countDocuments();

  if (count === 0) {
    console.log("Seeding database...");

    await Product.insertMany([
      {
        name: "Laptop",
        description: "Gaming laptop",
        price: 75000,
        category: "Electronics",
        sku: "LAP001",
        stock: 15
      },
      {
        name: "Phone",
        description: "Smartphone",
        price: 25000,
        category: "Electronics",
        sku: "PHN001",
        stock: 30
      },
      {
        name: "Headphones",
        description: "Wireless",
        price: 2000,
        category: "Accessories",
        sku: "HP001",
        stock: 50
      },
      {
        name: "Keyboard",
        description: "Mechanical",
        price: 1500,
        category: "Accessories",
        sku: "KEY001",
        stock: 40
      },
      {
        name: "Monitor",
        description: "27 inch",
        price: 12000,
        category: "Electronics",
        sku: "MON001",
        stock: 20
      },
      {
        name: "Chair",
        description: "Office chair",
        price: 5000,
        category: "Furniture",
        sku: "CHR001",
        stock: 10
      },
      {
        name: "Table",
        description: "Wooden desk",
        price: 8000,
        category: "Furniture",
        sku: "TBL001",
        stock: 8
      },
      {
        name: "Watch",
        description: "Digital watch",
        price: 3000,
        category: "Accessories",
        sku: "WCH001",
        stock: 25
      },
      {
        name: "Shoes",
        description: "Running shoes",
        price: 4000,
        category: "Fashion",
        sku: "SHO001",
        stock: 35
      },
      {
        name: "Backpack",
        description: "Travel bag",
        price: 2500,
        category: "Fashion",
        sku: "BAG001",
        stock: 22
      }
    ]);

    console.log("Seeding completed.");
  }
};

module.exports = seedProducts;
