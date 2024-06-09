const router = require("express").Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'di4mbudtl',
  api_key: '682311725795735',
  api_secret: 'qk5SrmU38B3iUVTyCKvE4E7VNg0'
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

const storagefile = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const allowedTypes = ['application/msword', 'application/pdf']; // Add supported doc types
    if (!allowedTypes.includes(file.mimetype)) {
      return new multer.MulterError('Unsupported file type'); // Reject unsupported types
    }
    const fileExt = file.originalname.split('.').pop();
    return {
      format: fileExt,
      public_id: `${Date.now()}-${file.originalname}`
    };
  }
});
const uploadFile = multer({ storage: storagefile });
router.post('/uploadfile', uploadFile.single('file'), async (req, res) => {
  try {
    console.log("req.fileeeeeeeeeeeee", req.file)
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

module.exports = router;