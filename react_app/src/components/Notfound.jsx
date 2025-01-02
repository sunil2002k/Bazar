import React from 'react';

const Notfound = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center py-10">
      <div className="text-red-500 mb-4">
        {/* Placeholder for icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v3.75m0 3.75h.01M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Product Not Available
      </h2>
      <p className="text-gray-600 max-w-md">
        Sorry, the product you are looking for is currently not available in your region. Please check back later or explore other products.
      </p>
    </div>
  );
};

export default Notfound;
