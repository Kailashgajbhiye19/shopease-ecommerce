const Product = require("../models/product.model");

const getProducts = async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $option: "i" } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const count = await Product.countDocuments({ ...keyword, ...category });
  const products = await Product.find({ ...keyword, ...category })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: "Product not found" });
};

const createProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price || 0,
    image: req.body.image || "/images/sample.jpg",
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock || 0,
    description: req.body.description,
  });
  const created = await product.save();
  res.status(201).json(created);
};

const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = await product.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: "Product remove" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
