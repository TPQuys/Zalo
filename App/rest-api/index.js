const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const  cors =require("cors");
const bodyParser = require("body-parser")
const requestAddFriendRoute = require("./routes/requestAddFriend");
const uploadImageRoute = require("./fileAWS/uploadImage");


// const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const groupRoute = require("./routes/groups");

const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:19007',"http://localhost:19008", 'http://localhost:19006','exp://192.168.0.102:8081'],
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
const router = express.Router();
const path = require("path");

dotenv.config();

mongoose
  .connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true

  })
  .then(() => {
    console.log("Connected to MongoDB");
  });
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/requestAddFriend", requestAddFriendRoute);
app.use("/api/uploadImage", uploadImageRoute);
app.use("/api/group", groupRoute);
app.listen(8800, () => {
  console.log("Backend server is running!");
});
