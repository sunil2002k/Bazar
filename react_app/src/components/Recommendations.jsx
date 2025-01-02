import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Recommendations = ({ productId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/recommendations/${productId}`
        );
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId]);

  if (loading)
    return (
      <p className="text-center text-gray-500">Loading recommendations...</p>
    );
    const handleProduct = (_id) => {
        navigate(`/product/${_id}`);
      };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Related products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendations.length > 0 ? (
          recommendations.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProduct(product._id)}
            >
              <img
                src={`http://localhost:8000/${product.images[0]}`}
                alt={product.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="text-md font-semibold text-gray-800 truncate">
                  {product.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {product.category}
                </p>
                <p className="text-green-500 font-bold mt-2">
                  ₹ {Number(product.price).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
