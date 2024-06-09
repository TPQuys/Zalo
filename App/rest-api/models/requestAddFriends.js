const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    senderid: {
      type: String,
      default: "",
    },
    recieveid: {
      type: String,
      required: "",
    },
    status: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("requestAddFriends", UserSchema);
