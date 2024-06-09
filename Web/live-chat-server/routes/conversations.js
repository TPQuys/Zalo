const router = require("express").Router();
const Conversation = require("../models/conversations");

//new conv

router.post("/getnewconv", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/getnewconvGroup", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.groupid],
    isgroup: true,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/getcurrentGroup", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.body.groupid] },
      isgroup: true,
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user
router.get("/userId", async (req, res) => {
  try {
    console.log("req.body.userId",req.body.userId)
    const conversation = await Conversation.find({
      members: { $in: [req.body.userId] },
    });
    console.log("conversation >>>>",conversation);
    res.status(200).json(conversation);
  } catch (err) {
    console.log("err >>>>",err);
    res.status(500).json(err);
  }
});

router.post("/getcurrentChat", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.body.userId, req.body.receiverId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
