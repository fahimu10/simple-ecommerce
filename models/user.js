const { Schema, model } = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxLength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email, role: this.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
};

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
};

module.exports.User = model("User", userSchema);
module.exports.validate = validateUser;
