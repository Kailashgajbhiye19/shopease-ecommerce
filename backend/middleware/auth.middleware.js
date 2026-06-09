const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const protect = async (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: `Not authorized` });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  res.status(401).json({ message: "Not authorized as admin" });
};

module.exports = { protect, admin };
