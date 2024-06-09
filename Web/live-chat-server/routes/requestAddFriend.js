1
const router = require("express").Router();
const requestAddFriends = require("../models/requestAddFriends");
const User = require("../models/User");

//REGISTER
router.post("/", async (req, res) => {
    try {
        //create new request
        const newRequestAddFriend = new requestAddFriends({
            senderid: req.body.senderid,
            recieveid: req.body.recieveid,
            status: 0,
        });
        console.log(req.body)
        //save user and respond
        const requestAddFriend = await newRequestAddFriend.save();
        res.status(200).json(requestAddFriend);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.post("/check", async (req, res) => {
    if (req.body.recieveid !== req.body.senderid) {
        try {
            const user = await User.findOne({ phonenumber: req.body.recieveid });
            const currentUser = await User.findOne({ phonenumber: req.body.senderid });
            if (user && currentUser && !user.friends.includes(currentUser._id.toString())) {
                const requestAddFriend = await requestAddFriends.findOne({ $and: [{ senderid: req.body.senderid }, { recieveid: req.body.recieveid }] });
                console.log(requestAddFriend)
                console.log(requestAddFriend.status)
                return res.status(200).json(requestAddFriend.status);
            }
        else{res.status(200).json(2)}
        } catch (err) {
            return res.status(500).json(-1);
        }
    } else {
        res.status(200).json(3)
    }
});


router.post("/list", async (req, res) => {
    try {
        const requestAddFriend = await requestAddFriends.find({ $and: [{ recieveid: req.body.recieveid }, { status: 0 }] });
        // console.log(user)
        console.log(requestAddFriend)
        if (requestAddFriend) {
            return res.status(200).json(requestAddFriend);
        }
        return res.status(400).json("invail request");
    } catch (err) {
        return res.status(500).json("server error !");
    }
});

router.put("/update", async (req, res) => {
    try {
        const requestAddFriend = await requestAddFriends.findOneAndUpdate({ $and: [{ senderid: req.body.senderid }, { recieveid: req.body.recieveid }] },
            { status: 1 }, { new: true }
        );
        // console.log(user)
        console.log(requestAddFriend)
        if (requestAddFriend) {
            return res.status(200).json(requestAddFriend);
        }
        return res.status(400).json("invail request");
    } catch (err) {
        return res.status(500).json("server error !" + err);
    }
});

router.delete("/delete", async (req, res) => {
    try {
        const requestAddFriend = await requestAddFriends.findOneAndDelete({ $and: [{ senderid: req.body.senderid }, { recieveid: req.body.recieveid }] });
        if (requestAddFriend) {
            return res.status(200).json("Yêu cầu kết bạn đã được xóa thành công");
        }
        return res.status(404).json("Không tìm thấy yêu cầu kết bạn để xóa");
    } catch (err) {
        console.error('Lỗi trong quá trình xóa yêu cầu kết bạn:', err);
        return res.status(500).json("Lỗi server: " + err);
    }
});


//xóa bạn
router.put("/update/unfriend", async (req, res) => {

    const userId = req.body.userId;
    const friendId = req.body.friendId;

    if (userId === friendId) {
        return res.status(403).json("You can't unfollow yourself");
    }

    try {
        
        // console.log(req.body)
        const user = await User.findOne({phonenumber:userId});
        const friend = await User.findOne({phonenumber:friendId});
        // console.log(user)
        // console.log(friend)
        const bo = await requestAddFriends.findOneAndDelete({ $or: [{ senderid: userId, recieveid: friendId }, { senderid: friendId, recieveid: userId }] });
        console.log(bo)
       try{
        await user.updateOne({ $pull: { friends: friend._id.toString() } });
        await friend.updateOne({ $pull: { friends: user._id.toString() } });
       }catch(err){
        res.status(300).json(err);
       }

        res.status(200).json(-1);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
