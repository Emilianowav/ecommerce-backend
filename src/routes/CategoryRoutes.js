const express = require ("express")
const router = express.Router();
const {getCategories ,createCategory, deleteCategory } = require("../controllers/categoryController");
const {verifyToken} = require("../middlewares/authMiddleware")


router.get("/", getCategories)
router.post("/", verifyToken,createCategory)
router.put("/:id", verifyToken, deleteCategory)

module.exports = router;