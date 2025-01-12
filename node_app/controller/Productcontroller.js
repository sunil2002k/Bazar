const mongoose = require("mongoose");
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
  images: {
    type: [String], // Array of strings (paths)
    required: true,
  },
  prod_status: {
    type: String,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ploc: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },
});
sellprodSchema.index({ ploc: "2dsphere" });

const Sellingproduct = mongoose.model("Sellingproduct", sellprodSchema);
module.exports.search = (req, res) => {
  let search = req.query.search;
  let latitude = req.query.loc.split(",")[0];
  let longitude = req.query.loc.split(",")[1];
  Sellingproduct.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { price: { $regex: search, $options: "i" } },
    ],
    ploc: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(latitude), parseFloat(longitude)],
        },
        $maxDistance: 500 * 1000,
      },
    },
  })
    .then((results) => {
      res.send({ message: "success", products: results });
    })
    .catch((err) => {
      console.error(err);
      res.send({ message: "server error" });
    });
};

module.exports.myads = (req, res) => {
  const userId = req.body.userId;
  Sellingproduct.find({ addedBy: userId })
    .then((result) => {
      res.send({ message: "success", products: result });
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};
module.exports.deleteprod = (req, res) => {
  console.log(req.body);
  Sellingproduct.findOne({ _id: req.body.pid })
    .then((result) => {
      if (result.addedBy == req.body.userId) {
        Sellingproduct.deleteOne({ _id: req.body.pid })
          .then((deleteResult) => {
            if (deleteResult.acknowledged)
              res.send({ message: "delete success" });
          })
          .catch(() => {
            res.send({ message: "server error" });
          });
      }
    })
    .catch(() => {
      res.send({ message: "server error" });
    });
};
module.exports.editprod = async (req, res) => {
  try {
    const { pid, title, description, price, category, userId } = req.body;

    // Check if product exists and belongs to the user
    const existingProduct = await Sellingproduct.findOne({
      _id: pid,
      addedBy: userId,
    });
    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized access" });
    }

    // Prepare update data
    const updateData = { title, description, price, category };

    // If new images are uploaded, update images
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.path); // Store new image paths
    }

    // Update the product in the database
    const updatedProduct = await Sellingproduct.findByIdAndUpdate(
      pid,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports.sellprod = async (req, res) => {
  try {
    const { title, description, price, category,prod_status } = req.body;
    const addedBy = req.body.userId;
    const plat = req.body.plat;
    const plong = req.body.plong;
    const images = req.files.map((file) => file.path);

    const product = new Sellingproduct({
      title,
      description,
      price,
      category,
      images,
      addedBy,
      prod_status,
      ploc: { type: "Point", coordinates: [plat, plong] },
    });

    const savedProduct = await product.save();

    res
      .status(201)
      .json({ message: "Product saved successfully", product: savedProduct });
  } catch (error) {
    console.error("Error saving product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports.sellget = (req, res) => {
  Sellingproduct.find()
    .then((result) => {
      res.send({ message: "success", products: result });
    })
    .catch((err) => {
      console.error(err);
      res.send({ message: "server error" });
    });
};
module.exports.prodetail = (req, res) => {
  console.log(req.params);
  Sellingproduct.findOne({ _id: req.params.pId })
    .then((result) => {
      res.send({ message: "success", product: result });
    })
    .catch((err) => {
      console.error(err);
      res.send({ message: "server error" });
    });
};

module.exports.recommend = async (req, res) => {
  const { productId } = req.params;
  const product = await Sellingproduct.findById(productId);

  if (!product) return res.status(404).send("Product not found");

  const recommendations = await Sellingproduct.find({
    category: product.category, // Example filter by category
    _id: { $ne: productId }, // Exclude the current product
  }).limit(5);

  res.json(recommendations);
};
