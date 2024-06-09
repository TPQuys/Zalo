const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    conversationid: {
      type: String,
      default: "",
    },
    senderid: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    isseen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", UserSchema);
