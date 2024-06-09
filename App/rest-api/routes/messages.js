const router = require("express").Router();
const Message = require("../models/messages");

//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  console.log("newMessage", newMessage);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/upload", async (req, res) => {
  console.log("req.file", req.body.formData);
});

//get

router.post("/conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationid: req.body.conversationid,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/getMessageByConverationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationid: req.body.conversationid,
    })
      .populate("senderid", "_id username avatarpicture")
      .exec();
    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
  }
});
router.post("/createMessage", async (req, res) => {
  const { senderid, content, conversationid } = req.body;
  try {
    const new_message = new Message({
      senderid,
      content,
      isSeen: 0,
      conversationid,
    });
    const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }); // Adjust time zone as needed
    new_message.createdAt = currentDateTime;
    await new_message.save();

    const result = await Message.findOne({ _id: new_message._doc._id })
      .populate("senderid", "_id username avatarpicture")
      .exec();

      return res.status(200).json(result);

  } catch (error) {
    console.log(error);
  }
});

//put
router.put("/delete", async (req, res) => {
  console.log(req.body.id)
  try {
    const messages = await Message.findByIdAndUpdate(req.body.id,
    {status:1},{new:true});
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});
//thả cảm xúc
router.put("/reaction", async (req, res) => {
  try {
    const { id, emoji, senderid } = req.body;

    if (!id || !emoji || !senderid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { $push: { emojis: { senderid, emoji } } },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//thả cảm xúc
router.put("/reaction/remove", async (req, res) => {
  try {
    const { id, senderid } = req.body;

    if (!id || !senderid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { $pull: { emojis: { senderid } } },
      { new: true }
    );

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
