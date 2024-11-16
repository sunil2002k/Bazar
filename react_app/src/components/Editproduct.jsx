import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import Categories from "./CategoriesList";
import { useNavigate, useParams } from "react-router-dom";

const Editproduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: [],
  });
  const [search, setSearch] = useState("");
  const [issearch, setisSearch] = useState(false);
  const [existingImages, setExistingImages] = useState([]); // Holds URLs of existing images
  const [newImages, setNewImages] = useState([]); // Holds previews of new images
  const { productId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const url = `http://localhost:8000/sell/${productId}`;
    axios
      .get(url)
      .then((res) => {
        if (res.data.product) {
          const product = res.data.product;
          setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            images: [],
          });

          // Load existing images with full URLs
          const fullImageUrls = (product.images || []).map(
            (imgPath) => `http://localhost:8000/${imgPath}`
          );
          setExistingImages(fullImageUrls);
        }
      })
      .catch(() => {
        alert("Server error occurred");
      });
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetSearch = () => {
    setSearch("");
    setisSearch(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files.map((file) => URL.createObjectURL(file))); // Preview new images
    setFormData({
      ...formData,
      images: files,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("pid", productId);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("userId", localStorage.getItem("userId"));
  
    formData.images.forEach((image) => {
      data.append("images", image);
    });
  
    console.log([...data]); // Log the FormData to see its content
  
    axios
      .post("http://localhost:8000/edit_product", data)
      .then((res) => {
        console.log("Success:", res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
      navigate("/");
      window.location.reload();
  };
  

  return (
    <>
      <Navbar search={search} resetSearch={resetSearch} />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 block text-gray-700 text-center">
          Edit Your Product
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Product Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Product Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Product Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Product Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 mb-2">
              Product Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Product Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 mb-2">
              Product Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="">Select a category</option>
              <option value="bikes">Bikes</option>
              <option value="mobile">Mobile</option>
              <option value="clothes">Clothes</option>
              {Categories &&
                Categories.length > 0 &&
                Categories.map((item, index) => (
                  <option key={"option" + index}>{item}</option>
                ))}
            </select>
          </div>

          {/* Existing Images */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Existing Images</label>
            <div className="flex gap-2">
              {existingImages.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Existing Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Product Images (File Upload) */}
          <div className="mb-4">
            <label htmlFor="images" className="block text-gray-700 mb-2">
              Upload New Images
            </label>
            <input
              type="file"
              id="images"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md"
              multiple
              
            />
            <div className="flex gap-2 mt-2">
              {newImages.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`New Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Editproduct;
