import React from "react";

export const Button = ({
  children,
  onClick,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyle =
    "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    outline:
      "bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-50 focus:ring-blue-500",
  };

  const buttonStyle = `${baseStyle} ${variants[variant]} ${className}`;

  return (
    <button className={buttonStyle} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
