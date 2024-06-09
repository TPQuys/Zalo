const router = require("express").Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dctyqb6u1', 
  api_key: '578582258225782', 
  api_secret: 'YcWCIBhk2vpq1x0PKkjfkEjeK_Q' 
});
// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

// Cấu hình lưu trữ ảnh trên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Extract file extension
    const fileExt = file.originalname.split('.').pop();
    return {
      folder: 'zalo',
      format: fileExt,
      public_id: `${Date.now()}-${file.originalname}`
    };
  }
});

const uploadImage = multer({ storage: storage });
router.post('/upload', uploadImage.single('file'), async (req, res) => {
  try {

    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${Date.now()}`,
      resource_type: "auto"
    })
    console.log("result", result)
    return res.status(200).json({
      public_id: result.public_id,
      url: result.secure_url
    })

  } catch (err) {
    console.log("Error", err)
    return res.status(400).json({ error: err })
  }

});
const storageFile = multer.diskStorage({
  filename: async (req, file, cb) => {
    try {
      // Tạo tên file duy nhất với timestamp
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    } catch (error) {
      cb(error);
    }
  }
});

const uploadFile = multer({ storage: storageFile }).single('file');

router.post('/uploadfile', uploadFile, async (req, res) => {
  try {
    // Kiểm tra xem có file được gửi lên không
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được tải lên.' });
    }

    // Thực hiện tải lên file lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "file",
      public_id: `${Date.now()}-${req.file.originalname}`,
      resource_type: "auto"
    });

    console.log("result", result);

    // Trả về thông tin về file đã tải lên
    return res.status(200).json({
      public_id: result.public_id,
      url: result.secure_url
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(400).json({ error: 'Đã xảy ra lỗi khi tải lên file.' });
  }
});

module.exports = router;