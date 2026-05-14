const express = require("express");
const {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:userId", getUserById);
router.put("/:userId", updateUserProfile);

module.exports = router;
