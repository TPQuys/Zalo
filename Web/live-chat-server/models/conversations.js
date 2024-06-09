const mongoose = require("mongoose");
mongoose.set('debug',true)
const UserSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      default: [],
    },
    isgroup: {
      type: Boolean,
      default: false,
    },
    lastmessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversations", UserSchema);
