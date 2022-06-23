const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { JWT_TOKEN_SECRET } = process.env;

exports.signup = [
  body("name", "Name is required").trim().isLength({ min: 1 }).escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Provide a valid email"),
  body("password", "Password is required")
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@_$!%*#?&])[A-Za-z\d@$!_%*#?&]{8,}/)
    .withMessage(
      "Minimum eight characters, at least one letter, one number and one special character (@_$!%*#?&)"
    ),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({
        success: false,
        msg: "Error sign-up",
        data: null,
        errors: errors.array(),
      });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        success: false,
        msg: "Error sign-up",
        data: null,
        errors: [{ param: "email", msg: "Email already used." }],
      });
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });

        await user.save();

        return res.status(200).json({
          success: true,
          msg: "Regitration success",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
          errors: null,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          msg: "An error occured",
          data: null,
          errors: [
            { param: "password", msg: error.message || "An error occurred" },
          ],
        });
      }
    }
  },
];

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Error sign-up",
        data: null,
        errors: [{ msg: "Invalid credentials." }],
      });
    }
    const isMatch = await bcrypt.compare(password);
    if (!isMatch) {
      return res.status(400).json({
        success: true,
        msg: "Error sign-in",
        data: null,
        errors: [{ msg: "Invalid credentials." }],
      });
    }
    const token = jwt.sign({ id: user._id }, JWT_TOKEN_SECRET);
    return res.json({
      success: true,
      msg: "OK",
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          type: user.type,
          isAdmin: user.isAdmin,
        },
      },
      errors: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "An error occured",
      data: null,
      errors: [{ msg: error.message || "An error occurred" }],
    });
  }
};

exports.tokenIsValid = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);
    const user = User.findById(verified._id);
    if (!user) {
      return res.json(false);
    }
    return res.json(true);
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "An error occured",
      data: null,
      errors: [{ msg: error.message || "An error occurred" }],
    });
  }
};
