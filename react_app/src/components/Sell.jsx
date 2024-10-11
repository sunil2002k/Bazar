import { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

const Sell = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    
    images: [], // Handle images as an array of files
  });

  const [fileNames, setFileNames] = useState([]); // State to store the file names

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert filelist to an array
    setFileNames(files.map((file) => file.name)); // Set the file names in state
    setFormData({
      ...formData,
      images: files, // Set the array of image files in the state
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    
    formData.images.forEach((image) => {
      data.append('images', image);
    });
  
    // Log FormData for debugging
    for (let pair of data.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
    axios.post("http://localhost:8000/sell", data)
      .then((res) => {
        console.log("Success:", res.data);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 block text-gray-700 text-center">
          Sell Your Product
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
              onChange={handleFileChange} // Handle file change separately
              className="w-full px-4 py-2 border rounded-md"
              multiple // Allow multiple files
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
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Sell;
