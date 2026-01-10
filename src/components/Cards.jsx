import React from "react";
import { Link } from "react-router-dom";
import service from "../appwite/configu";

const postItColors = [
  "bg-yellow-200 border-yellow-300",
  "bg-pink-200 border-pink-300",
  "bg-blue-200 border-blue-300",
  "bg-green-200 border-green-300",
  "bg-purple-200 border-purple-300",
  "bg-orange-200 border-orange-300"
];

export default function Cards({ $id, title, featuredImage }) {
  const randomColor = postItColors[Math.floor(Math.random() * postItColors.length)];

  return (
    <Link to={`/post/${$id}`} className="block group">
      <div className={`relative ${randomColor} border-2 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl duration-500 hover:scale-105 transition-all transform rotate-1 hover:rotate-0 hover:-translate-y-1`}>
        {/* Post-it tape effect */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-300 rounded-t-full shadow-sm"></div>

        {featuredImage && (
          <img
            src={service.getfilePreview(featuredImage).href}
            alt={title}
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className="p-3">
          <h2 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
            {title}
          </h2>
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-gray-400 rounded-full opacity-20"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-gray-500 rounded-full opacity-30"></div>
        </div>
      </div>
    </Link>
  );
}
