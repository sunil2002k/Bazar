const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
  mobile: {
    type: String,
    required: true,
  },
  liked_products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Sellingproduct" },
  ],
});
const SignupUser = mongoose.model("signupData", signupSchema);

module.exports.myprofile = (req, res) => {
  let uid = req.params.userId;
  SignupUser.findOne({ _id: uid })
    .then((result) => {
      if (!result) {
        // No user found with the provided ID
        return res.status(404).send({ message: "User not found" });
      }

      // If user is found, send user data
      res.send({
        message: "success",
        user: {
          email: result.email,
          mobile: result.mobile,
          username: result.username,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "server error" });
    });
};
module.exports.editusername = async (req, res) => {
  try {
    const { username } = req.body; 
    const userId = req.params.id; 
    const updatedUser = await SignupUser.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Username updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating username:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
module.exports.signup = async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSignup = new SignupUser({
      username,
      email,
      password: hashedPassword,
      mobile,
    });
    await newSignup.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.login = async (req, res) => {
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
    res.json({
      msg: "Login successful",
      username: user.username,
      userId: user._id,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
module.exports.like = (req, res) => {
  const { productId, userId } = req.body;

  let isLiked;

  SignupUser.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      isLiked = user.liked_products.includes(productId);
      const update = isLiked
        ? { $pull: { liked_products: productId } } // Unlike
        : { $addToSet: { liked_products: productId } }; // Like

      return SignupUser.updateOne({ _id: userId }, update);
    })
    .then(() => {
      // Use isLiked here without error
      res.json({ message: isLiked ? "Unliked" : "Liked", isLiked: !isLiked });
    })
    .catch((error) => {
      res.status(500).json({ message: "Server error", error: error.message });
    });
};
module.exports.liked = (req, res) => {
  SignupUser.findOne({ _id: req.body.userId })
    .populate("liked_products")
    .then((result) => {
      res.send({ message: "success", products: result.liked_products });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};
module.exports.contactdetail = (req, res) => {
  const _userId = req.params.uId;

  SignupUser.findOne({ _id: _userId })
    .then((result) => {
      if (!result) {
        // No user found with the provided ID
        return res.status(404).send({ message: "User not found" });
      }

      // If user is found, send user data
      res.send({
        message: "success",
        user: {
          email: result.email,
          mobile: result.mobile,
          username: result.username,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "server error" });
    });
};
