import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import Categories from "./CategoriesList";
import { useNavigate } from "react-router-dom";
import picture from "../assets/56067.jpg";

const Sell = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    prod_status: "",
    images: [],
  });
  const [search, setSearch] = useState("");
  const [, setisSearch] = useState(false);
  const navigate = useNavigate();
  const [fileNames, setFileNames] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileNames(files.map((file) => file.name));
    setFormData({
      ...formData,
      images: files,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition((position) => {
      const data = new FormData();
      data.append("plat", position.coords.latitude);
      data.append("plong", position.coords.longitude);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("prod_status", formData.prod_status);
      data.append("userId", localStorage.getItem("userId"));

      formData.images.forEach((image) => {
        data.append("images", image);
      });

      axios
        .post("http://localhost:8000/sell", data)
        .then((res) => {
          console.log("Success:", res.data);
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    });
    navigate("/");
  };

  return (
    <>
      <Navbar search={search} resetSearch={resetSearch} />
      <div
        className="bg-white h-full mb-2 right-0 w-full animate-fade"
        style={{
          backgroundImage: `url(${picture})`,
          backgroundSize: "contain",
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-lg  p-6 ml-72 bg-white shadow-md rounded-md ">
          {/* Modal for Rules */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl text-center font-bold mb-4">Rules</h2>
                <div>
                  <p>
                    Please follow these rules before uploading a product:
                    <ol className="list-decimal ml-6 mt-2">
                      <li>
                        Ensure the product description is clear and accurate.
                      </li>
                      <li>Upload only high-quality images of the product.</li>
                      <li>Set a reasonable price for the product.</li>
                      <li>Choose the correct category for the product.</li>
                      <li>Avoid uploading prohibited items.</li>
                    </ol>
                  </p>
                </div>
                <div className="text-center mt-4">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6 block text-gray-700 text-center">
            Sell Your Product
          </h2>

          {/* Rules Link */}
          <div className="text-right mb-4">
            <button
              className="text-blue-500 hover:underline text-sm"
              onClick={() => setShowModal(true)}
            >
              View Rules
            </button>
          </div>

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
            {/* Product Status */}
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700 mb-2">
                Product Status
              </label>
              <div className="flex gap-4">
                {/* Radio button for "New" */}
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="new"
                    name="prod_status" // Make sure this matches the formData field name
                    value="New" // Value for "New" status
                    // checked={formData.prod_status === "new"} // This ensures the "New" button is selected when formData.prod_status is "new"
                    onChange={handleChange} // Update state on change
                    className="cursor-pointer"
                  />
                  <span>New</span>
                </label>

                {/* Radio button for "Old" */}
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="old"
                    name="prod_status" // Make sure this matches the formData field name
                    value="Old" // Value for "Old" status
                    // checked={formData.prod_status === "old"} // This ensures the "Old" button is selected when formData.prod_status is "old"
                    onChange={handleChange} // Update state on change
                    className="cursor-pointer"
                  />
                  <span>Old</span>
                </label>
              </div>
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
                {Categories &&
                  Categories.length > 0 &&
                  Categories.map((item, index) => {
                    return (
                      <option key={"option" + index} value={item}>
                        {item}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* Product Images */}
            <div className="mb-4">
              <label htmlFor="images" className="block text-gray-700 mb-2">
                Product Images
              </label>
              <input
                type="file"
                id="images"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-md"
                multiple
                required
              />
              {fileNames.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected files: {fileNames.join(", ")}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Sell;
