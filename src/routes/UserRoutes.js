const express = require("express");
const router = express.Router();
const {getUsers,getUsersById,createNewUserAuth,createUserProfile, userLogin} = require("../controllers/userController")
const {verifyToken} = require("../middlewares/authMiddleware")


router.get("/", getUsers)
router.get("/:id", getUsersById)
router.post("/", createNewUserAuth)
router.post("/profile", verifyToken, createUserProfile)
router.post("/login", userLogin)

module.exports = router;
