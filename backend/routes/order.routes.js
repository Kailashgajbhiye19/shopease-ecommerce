const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
} = require("../controllers/order.controller.js");
const { protect, admin } = require("../middleware/auth.middleware.js");

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getAllOrders);
router.get("/mine", protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);

module.exports = router;
