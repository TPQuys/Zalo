const mongoose = require("mongoose");
mongoose.set('debug', true);
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    phonenumber: {
      type: String,
      require: true,
      unique: true,
    },
    avatarpicture: {
      type: String,
      default: "https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-2.jpg",
    },
    gender: {
      type: Number,
      default: 0,
    },
    birth: {
      type: Date,
      default: new Date('1999-01-01'),
    },
    friends: {
      type: Array,
      default: [],
    },
    group: {
      type: Array,
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("users", UserSchema);
