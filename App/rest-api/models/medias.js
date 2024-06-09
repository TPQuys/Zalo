const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    conversationid: {
      type: String,
      default: "",
    },
    mediatype: {
      type: Number,
      default: 0,
    },
    senderid: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("medias", UserSchema);
