const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 100,
    },
    email: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    address: {
      type: String,
    },
    type: {
      type: String,
      default: "user",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
