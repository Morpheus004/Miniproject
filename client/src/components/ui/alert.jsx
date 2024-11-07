import React from 'react';

const Alert = ({ variant, children }) => {
  const variantStyles = {
    destructive:
      ' text-sm text-red-700 px-4 py-3 rounded relative',
  };

  return (
    <div className={`${variantStyles[variant]} mt-2`} role="alert">
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => {
  return <div className="font-medium">{children}</div>;
};

export { Alert, AlertDescription };