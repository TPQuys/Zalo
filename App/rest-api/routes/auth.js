const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      phonenumber: req.body.phonenumber,
      avatarpicture: req.body.avatarPicture,
      gender: req.body.gender,
      birth: req.body.birth
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});
//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ phonenumber: req.body.phonenumber });
    if (!user) {
      return res.status(404).json("user not found");
    }
    const validPassword = await bcrypt.compare(req.body.password, user._doc.password)
    if (!validPassword) {
      return res.status(400).json("wrong password");
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json("server error !");
  }
});


module.exports = router;
