const Product = require("../models/Product");
const redis = require("../config/redis");


exports.createProduct = async (req, res, next) => {
  try {
    const { name, price, category, sku, stock } = req.body;

    if (!name || price == null || !category || !sku || stock == null) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({
        message: "Price and stock must be non-negative"
      });
    }

    const product = await Product.create(req.body);

    
    const keys = await redis.keys("products:*");
    if (keys.length) await redis.del(keys);

    res.status(201).json(product);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "SKU must be unique" });
    }
    next(error);
  }
};



exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const cacheKey = `products:${page}:${limit}`;

    
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Cache HIT");
      return res.status(200).json(JSON.parse(cached));
    }

    console.log("Cache MISS - Fetching from DB");

    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    const response = {
      products,
      total,
      page,
      limit
    };

    
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    res.status(200).json(response);

  } catch (error) {
    next(error);
  }
};


exports.getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cacheKey = `product:${id}`;

    
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Single Product Cache HIT");
      return res.status(200).json(JSON.parse(cached));
    }

    console.log("Single Product Cache MISS - Fetching from DB");

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    await redis.set(cacheKey, JSON.stringify(product), "EX", 120);

    res.status(200).json(product);

  } catch (error) {
    next(error);
  }
};



exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    await redis.del(`product:${id}`);

    
    const keys = await redis.keys("products:*");
    if (keys.length) await redis.del(keys);

    res.status(200).json(product);

  } catch (error) {
    next(error);
  }
};



exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await redis.del(`product:${id}`);
    const keys = await redis.keys("products:*");
    if (keys.length) await redis.del(keys);

    res.status(204).send();

  } catch (error) {
    next(error);
  }
};
