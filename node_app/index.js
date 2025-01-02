const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
app.use(cors());
app.use(express.json());
const productController = require("./controller/Productcontroller");
const userController = require("./controller/Usercontroller");

const { ObjectId } = require("mongodb");
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
mongoose
  .connect("mongodb://127.0.0.1:27017/ecom")
  .then(() => {
    console.log("Connection with MongoDB is successful");
  })
  .catch((e) => {
    console.log(`${e}`);
  });

//*  my profile
app.get("/myprofile/:userId", userController.myprofile);

//*edit username
app.put("/myprofile/update/:id", userController.editusername);

//* Signup Route
app.post("/signup", userController.signup);

//* Login Route
app.post("/login", userController.login);

//* sell your product
const fs = require("fs");
const { type } = require("os");
const { title } = require("process");
const { log } = require("console");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post("/sell", upload.array("images", 5), productController.sellprod);

app.get("/sell", productController.sellget);

app.get("/sell/:pId", productController.prodetail);

//* contact details
app.get("/get-user/:uId", userController.contactdetail);

//* chat system
let messages = [];

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("sendMsg", (data) => {
    messages.push(data);
    io.emit("getMsg", messages);
  });
  io.emit("getMsg", messages);
});

//* recommendation system
app.get("/recommendations/:productId", productController.recommend);

//* search api
app.get("/search", productController.search);

//* likeproduct
app.post("/like_product", userController.like);
app.post("/liked_product", userController.liked);

//* my ads
app.post("/myproduct", productController.myads);

//* delete product
app.post("/delete_product", productController.deleteprod);

//* edit product

// Multer setup for image uploads
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload2 = multer({ storage: storage2 });

// Route to update product data
app.post(
  "/edit_product",
  upload2.array("images", 5),
  productController.editprod
);
const PORT = 8000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
