const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    groupname: {
      type: String,
      default: "",
    },
    grouppicture: {
      type: String,
      required: "https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645.jpg",
    },
    members: {
      type: Array,
      default: [],
    },
    createby: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("groups", UserSchema);
