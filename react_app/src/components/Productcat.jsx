import React from "react";
import categories from "./CategoriesList";

const Productcat = (props) => {
  return (
    <div className="flex flex-wrap  space-x-6 bg-white shadow-md px-6 py-3  mb-2">
      {/* "All Categories" Button */}
      <span
        className="cursor-pointer text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300"
        onClick={(e) => window.location.reload(e)}
      >
        All Categories
      </span>

      {/* Render Categories */}
      {categories &&
        categories.length > 0 &&
        categories.map((item, index) => (
          <span
            key={index}
            onClick={() => props.handleCategory && props.handleCategory(item)}
            className="cursor-pointer text-gray-700 font-medium hover:text-gray-900 hover:underline transition-transform duration-300"
          >
            {item}
          </span>
        ))}
    </div>
  );
};

export default Productcat;
