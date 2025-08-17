// SkeletonLoader.jsx
import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-pulse">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-48 h-64 bg-gray-300 rounded"></div>

        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-20 bg-gray-300 rounded w-full"></div>

          <div className="flex gap-2 mt-4">
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
