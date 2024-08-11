import React from "react";

export const Button = ({
  children,
  onClick,
  variant = "default",
  className = "",
}) => {
  const baseStyle = "px-4 py-2 rounded shadow";
  const variants = {
    default: "bg-blue-500 text-white",
    outline: "bg-transparent border border-blue-500 text-blue-500",
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
