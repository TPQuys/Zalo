const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
// router.put("/:id", async (req, res) => {
//   if (req.body.userId === req.params.id || req.body.isAdmin) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     }
//     try {
//       const user = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       res.status(200).json("Account has been updated");
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json("You can update only your account!");
//   }
// });

//delete user
router.delete("/:phonenumber", async (req, res) => {
  if (req.body.phonenumber === req.params.phonenumber || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

// get a user
router.post("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findOne({ _id: userId });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a user by phonenumber
router.post("/phonenumber", async (req, res) => {
  const usernumber = req.body.phonenumber;
  try {
    const user = await User.findOne({ phonenumber: usernumber });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});



//get friends
router.post("/friends/", async (req, res) => {
  try {
    const user = await User.findOne({ phonenumber: req.body.phonenumber });
    console.log(user)

    const friends = await Promise.all(
      user.friends.map((friendId) => {
        // console.log("3131" + friendId);
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, avatarpicture, phonenumber } = friend;
      friendList.push({ _id, username, avatarpicture ,phonenumber});
    });
    res.status(200).json(friendList)
    console.log(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});
//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

router.put("/resetpassword", async (req, res) => {
  if (req.body.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      const user = await User.findOneAndUpdate({ phonenumber: req.body.phonenumber }, {
        $set: {
          password: req.body.password
        }
      });
      res.status(200).json("Password has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(400).json("New password is required");
  }
});
router.put("/updateuser", async (req, res) => {

  try {
    const username = req.body.username;
    const gender = req.body.gender;
    const birth = req.body.birth;
    console.log(req.body);
    const user = await User.findOneAndUpdate({ phonenumber: req.body.phonenumber }, {
      $set: {
        username: username,
        gender: gender,
        birth: birth
      }
    });
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
}
);
router.put("/update/addFriend", async (req, res) => {
  if (req.body.fphonenumber !== req.body.uphonenumber) {
    try {
      // Tìm người dùng hiện tại và người dùng cần thêm vào danh sách bạn bè
      const user = await User.findOne({ phonenumber: req.body.fphonenumber });
      const currentUser = await User.findOne({ phonenumber: req.body.uphonenumber });

      // Kiểm tra xem người dùng cần thêm vào danh sách bạn bè đã tồn tại trong danh sách bạn bè của người dùng hiện tại chưa
      if (user && currentUser && !user.friends.includes(currentUser._id.toString())) {
        // Thêm người dùng cần thêm vào danh sách bạn bè của người dùng hiện tại
        await user.updateOne({ $push: { friends: currentUser._id.toString() } });
        // Thêm người dùng hiện tại vào danh sách bạn bè của người dùng cần thêm vào danh sách bạn bè
        await currentUser.updateOne({ $push: { friends: user._id.toString() } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});
router.put("/update/unfriend", async (req, res) => {
  if (req.body.userId !== req.params.friendId) {
    try {
      const user = await User.findById(req.body.userId);
      const friend = await User.findById(req.body.friendId);
      if (user.friends.includes(req.body.friendId)) {
        await user.updateOne({ $pull: { friends: req.body.friendId } });
        await friend.updateOne({ $pull: { friends: req.body.userId } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});
router.put("/update/info", async (req, res) => {
  try {
    const userId = req.body.userId;
    const { username, gender, birth, avatarpicture } = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Cập nhật thông tin người dùng
    user.username = username;
    user.gender = gender;
    user.birth = birth;
    user.avatarpicture = avatarpicture;

    // Lưu lại thông tin người dùng đã cập nhật vào cơ sở dữ liệu
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật thông tin người dùng", error: err });
  }
});
module.exports = router;
