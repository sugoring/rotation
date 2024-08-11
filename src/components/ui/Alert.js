import React from "react";

export const Alert = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyle = "p-4 rounded-md";
  const variants = {
    default: "bg-blue-100 text-blue-700",
    destructive: "bg-red-100 text-red-700",
  };

  const alertStyle = `${baseStyle} ${variants[variant]} ${className}`;

  return (
    <div className={alertStyle} role="alert" {...props}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = "", ...props }) => (
  <h3 className={`font-medium mb-1 ${className}`} {...props}>
    {children}
  </h3>
);

export const AlertDescription = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);
