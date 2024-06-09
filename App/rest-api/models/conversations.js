const mongoose = require("mongoose");
mongoose.set('debug', true);
const conversationSchema = new mongoose.Schema(
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

module.exports = mongoose.model("conversation", conversationSchema);
