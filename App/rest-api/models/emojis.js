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
      ref: "users",
    },
    status:{
      type:Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", UserSchema);
