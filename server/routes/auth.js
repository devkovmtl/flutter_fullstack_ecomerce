const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/api/signup", authController.signup);
router.post("/api/signin", authController.signin);
router.post("/api/tokenIsValid", authController.tokenIsValid);

module.exports = router;
