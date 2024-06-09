const router = require("express").Router();
const Group = require("../models/groups");
const User = require("../models/User");
//REGISTER
router.post("/", async (req, res) => {
    try {
        //create new request
        const group = new Group({
            groupname: req.body.groupname,
            grouppicture: req.body.grouppicture,
            members: req.body.members,
            createby: req.body.createby,
        });
        console.log(req.body)
        //save user and respond
        const reponse = await group.save();
        res.status(200).json(reponse);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});
router.post("/group", async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.body.groupId });
        // console.log(user)
        console.log(group)
        if (group) {
            return res.status(200).json(group);
        }
        return res.status(400).json("invail request");
    } catch (err) {
        return res.status(500).json("server error !");
    }
});

router.post("/list", async (req, res) => {
    try {
        const groups = await Group.find({ $or: [{ members: req.body.userId }, { createby: req.body.userId }] });
        console.log(groups);
        if (groups.length > 0) {
            return res.status(200).json(groups);
        }
        return res.status(400).json("invalid request");
    } catch (err) {
        console.error(err);
        return res.status(500).json("server error !");
    }
});

//rename
router.post("/rename", async (req, res) => {
    try {
        const name = req.body.name;
        console.log(name)
        // const groupId = mongoose.Types.ObjectId(req.body.groupId)
        // console.log(groupId)
        const group = await Group.findByIdAndUpdate(
            { _id: req.body.groupId }, // Query the document by its _id
            { groupname: name }, { new: true });
        console.log(group)
        return res.status(200).json(group);
    } catch (err) {
        console.log(err)
        return res.status(500).json("server error !");
    }
});
//leave group
router.post("/leave", async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log(userId)
        const group = await Group.findByIdAndUpdate(
            { _id: req.body.groupId }, // Query the document by its _id
            {
                $pull: { members: userId },
            }, { new: true });
        // console.log(group)
        if (group.createby === userId) {
            // Update createby to the next member in members array
            const nextCreator = group.members[0]; // Assuming the next member is the first one in the array
            const reponse = await Group.findByIdAndUpdate({ _id: req.body.groupId }, { createby: nextCreator });
            console.log(reponse)
        }
        if (group.members.length < 3) {
            await Group.deleteOne({ _id: req.body.groupId })
            return res.status(200).json("Nhóm đã bị xóa vì không đủ số thành viên")
        }
        return res.status(200).json("xóa thành công");
    } catch (err) {
        return res.status(500).json("server error !");
    }
});
//remove member
router.post("/member/remove", async (req, res) => {
    try {
        const { userId, memberId, groupId } = req.body;

        // Kiểm tra tính hợp lệ của dữ liệu đầu vào
        if (!userId || !memberId || !groupId) {
            return res.status(400).json("Dữ liệu không hợp lệ");
        }

        // Lấy thông tin nhóm
        const group = await Group.findById(groupId.toString());

        // Kiểm tra quyền hạn và xóa thành viên
        if (userId !== memberId) {
            if (group.createby === userId) {
                const groupUpdated = await Group.findByIdAndUpdate(
                    groupId,
                    { $pull: { members: memberId } },
                    { new: true }
                );
                if (group.members.length < 3) {
                    await Group.deleteOne({ _id: groupId })
                    return res.status(200).json("Nhóm đã bị xóa vì không đủ số thành viên")
                }
                console.log(groupUpdated);
                return res.status(200).json("Xóa thành công");
            } else {
                return res.status(403).json("Bạn phải là trưởng nhóm");
            }
        } else {
            return res.status(403).json("Không thể xóa bản thân");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json("Lỗi máy chủ");
    }
});
//add member
router.post("/member/add", async (req, res) => {
    try {
        const members = req.body.members; // Thay đổi memberId thành members
        console.log(members);
        // const groupId = mongoose.Types.ObjectId(req.body.groupId)
        // console.log(groupId)
        const group = await Group.findByIdAndUpdate(
            { _id: req.body.groupId }, // Truy vấn tài liệu bằng _id của nó
            {
                $push: { members: { $each: members } }, // Sử dụng $each để thêm từng phần tử trong danh sách members
            },
            { new: true }
        );
        console.log(group);
        return res.status(200).json(group);
    } catch (err) {
        return res.status(500).json("Lỗi máy chủ!");
    }
});
//đổi admin
router.post("/changeAdmin", async (req, res) => {
    try {
        const { userId, memberId, groupId } = req.body;

        // Kiểm tra tính hợp lệ của dữ liệu đầu vào
        if (!userId || !memberId || !groupId) {
            return res.status(400).json("Dữ liệu không hợp lệ");
        }

        // Lấy thông tin nhóm
        const group = await Group.findById(groupId);

        // Kiểm tra quyền hạn và xóa thành viên
        if (userId !== memberId) {
            if (group.createby === userId) {
                const groupUpdated = await Group.findByIdAndUpdate(
                    { _id: groupId },
                    { createby: memberId },
                    { new: true }
                );
                console.log(groupUpdated);
                return res.status(200).json(groupUpdated);
            } else {
                return res.status(403).json("Bạn phải là trưởng nhóm");
            }
        } else {
            return res.status(403).json("Bạn đang là trưởng nhóm");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json("Lỗi máy chủ");
    }
});

//list member
router.post("/members/list", async (req, res) => {
    try {
        console.log(req.body)
        const groups = await Group.findById(req.body.groupId);
        const members = groups.members
        console.log(members)
        const membersInfo = [];
        if (members) {
            for (const memberId of members) {
                console.log(memberId)
                const user = await User.findById({ _id: memberId.toString() });

                if (user) {
                    const { password, updatedAt, createdAt, birth, friends, group, keywords, ...userInfo } = user._doc;
                    membersInfo.push(userInfo);
                }
            }
            return res.status(200).json(membersInfo)
        }
        return res.status(400).json("invail request");
    } catch (err) {
        return res.status(500).json("server error !");
    }
});
//tìm bạn bè không có trong nhóm
router.post("/members/orther", async (req, res) => {
    try {
        console.log(req.body);
        const groups = await Group.findById(req.body.groupId);
        const members = groups.members;
        console.log(members);
        const membersInfo = [];
        if (members) {
            const memberIds = members.map(member => member.toString());

            const user = await User.findOne({ phonenumber: req.body.phonenumber });
            const userFriendIds = user.friends.map(friend => friend.toString());

            const otherUserIds = userFriendIds.filter(friendId => !memberIds.includes(friendId));

            const otherUsers = await User.find({ _id: { $in: otherUserIds } });

            for (const user of otherUsers) {
                const { password, updatedAt, createdAt, birth, friends, group, keywords, ...userInfo } = user._doc;
                membersInfo.push(userInfo);
            }

            return res.status(200).json(membersInfo);
        }
        return res.status(400).json("invalid request");
    } catch (err) {
        console.error(err);
        return res.status(500).json("server error !");
    }
});
//remove group
router.post("/remove", async (req, res) => {
    const { userId, groupId } = req.body;
    if (!userId || !groupId) {
        return res.status(400).json("Dữ liệu không hợp lệ");
    }
    try {
        // Lấy thông tin nhóm
        const group = await Group.findById(groupId.toString());

        // Kiểm tra quyền hạn và xóa thành viên
        if (group.createby === userId) {
            const groupUpdated = await Group.findByIdAndDelete(
                groupId
            );
            console.log(groupUpdated);
            return res.status(200).json("Xóa thành công");
        } else {
            return res.status(200).json("Bạn phải là trưởng nhóm");
        }
    } catch (err) {
    console.error(err);
    return res.status(500).json("Lỗi máy chủ");
}
});
module.exports = router;

