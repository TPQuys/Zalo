const GenerateToken = require("../Config/generateToken");

const expressAsyncHandler = require("express-async-handler");

const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await UserModel.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    res.send(users);
  });
  
  module.exports = {
    fetchAllUsersController,
  };