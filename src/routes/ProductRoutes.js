const express = require("express");
const router = express.Router();
const {getProducts, getSearchedProduct,getProductBySlug ,createProduct, deleteProduct} = require("../controllers/productController")
const {verifyToken} = require("../middlewares/authMiddleware")


router.get("/", getProducts)
router.get("/search", getSearchedProduct)
router.post("/" , verifyToken, createProduct)
router.put("/:id", verifyToken, deleteProduct)
router.get("/slug/:slug", getProductBySlug);

module.exports = router;
