const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require('path');
app.use(cors());
app.use(express.json());
const { ObjectId } = require('mongodb');


mongoose
  .connect("mongodb://127.0.0.1:27017/ecom")
  .then(() => {
    console.log("Connection with MongoDB is successful");
  })
  .catch((e) => {
    console.log(`${e}`);
  });

const signupSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  liked_products:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Sellingproduct'}]
});

//search api

app.get('/search', (req, res)=>{
  
  let search = req.query.search;

  Sellingproduct.find({
    $or:[
    { title: {$regex : new RegExp(search, 'i') } },
    { description: {$regex :new RegExp(search, 'i')} },
    { price: {$regex : new RegExp(search, 'i')} },
    ]
  })
    .then((results) => {
      res.send({ message: 'success', products: results });
    })
    .catch((err) => {
      console.error(err); 
      res.send({ message: 'server error' });
    });
})




// likeproduct

app.post('/like_product',(req,res)=>{
  let productId = req.body.productId;
  let userId = req.body.userId;
  console.log(req.body);
  

  SignupUser.updateOne({ _id: new ObjectId(userId)} , { $addToSet : {liked_products : productId}})
  .then((result) => {
    if (result.modifiedCount === 0) {
      throw new Error('No document matched');
    }
    res.json({ message: 'Like success' });
  })
  .catch((err) => {
    res.status(500).json({ message: 'Server error occurred', error: err.message });
  });
})

app.post('/liked_product', (req, res) => {
  SignupUser.findOne().populate('liked_products')
    .then((result) => {
      res.send({ message: 'success', products: result.liked_products });
    })
    .catch(() => {
      res.send({ message: 'server error' });
    });
});

const SignupUser = mongoose.model("signupData", signupSchema);

// Signup Route 

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSignup = new SignupUser({
      username,
      email,
      password: hashedPassword,
    });
    await newSignup.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database using the correct model
    let user = await SignupUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Return success response (you can also add JWT for session management)
    res.json({ msg: "Login successful", username: user.username, userId: user._id });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// sell your product

const sellprodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
   
  },
  description: {
    type: String,
    required: true,
    
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: { // Change this field to hold multiple images
    type: [String], // Array of strings (paths)
    required: true,
  },
});
const Sellingproduct = mongoose.model("Sellingproduct", sellprodSchema);
const fs = require('fs');
const { type } = require("os");
const { title } = require("process");
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/sell", upload.array("images", 15), async (req, res) => {
  try {
    console.log("Request body:", req.body);  // Log the incoming request body
    console.log("Files:", req.files);        // Log the files being uploaded
    
    const { title, description, price, category } = req.body;
    const images = req.files.map((file) => file.path);

    const product = new Sellingproduct({
      title,
      description,
      price,
      category,
      images,
    });

    const savedProduct = await product.save();
    console.log("Product saved:", savedProduct);  // Log the saved product
    
    res.status(201).json({ message: "Product saved successfully", product: savedProduct });
  } catch (error) {
    console.error("Error saving product:", error.message);  // Log any errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



app.get('/sell', (req, res) => {
  Sellingproduct.find()
    .then((result) => {
      console.log("Products fetched:", result); 
      res.send({ message: 'success', products: result });
    })
    .catch((err) => {
      console.error(err); 
      res.send({ message: 'server error' });
    });
});

app.get('/sell/:pId', (req, res) => {
  console.log(req.params)
  Sellingproduct.findOne({_id: req.params.pId})
    .then((result) => {
      console.log("Product fetched:", result); 
      res.send({ message: 'success', product: result });
    })
    .catch((err) => {
      console.error(err); 
      res.send({ message: 'server error' });
    });
});

const PORT = 8000;

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
