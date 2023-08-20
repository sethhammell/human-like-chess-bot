import React from "react";

interface CardProps {
  children: React.ReactNode;
  width?: string;
}

const Card: React.FC<CardProps> = ({ children, width = "w-full" }) => {
  return (
    <div
      className={`card bg-gray-800 ${width} max-w-md mx-auto rounded-lg shadow-custom-light p-6`}
    >
      <p className="text-gray-400">{children}</p>
    </div>
  );
};

export default Card;
