const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    groupname: {
      type: String,
      default: "",
    },
    grouppicture: {
      type: String,
      default: "https://www.ztest.vn/wp-content/plugins/profilegrid-user-profiles-groups-and-communities/public/partials/images/default-group.png",
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
