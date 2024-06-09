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
    content: {
      type: String,
      default: "",
    },
    isseen: {
      type: Boolean,
      default: true,
    },
    status:{
      type:Number,
      default: 0
    },
    emojis:{
      type:Array,
      default:[]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", UserSchema);
