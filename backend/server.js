const dotenv = require("dotenv");
dotenv.config(); // ← Must be first!
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.config.js");
const { notFound, errorHandler } = require("./middleware/error.middleware.js");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shopease-ecommerce-vert.vercel.app/",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/products", require("./routes/product.routes.js"));
app.use("/api/orders", require("./routes/order.routes.js"));
app.use("/api/payment", require("./routes/payment.routes.js"));

app.get("/", (req, res) => res.send("ShopEase API is running..."));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
