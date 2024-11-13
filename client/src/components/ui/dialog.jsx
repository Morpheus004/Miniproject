import React from 'react';

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? 'visible' : 'invisible'
      }`}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};

const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

const DialogTitle = ({ children }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};

export { Dialog, DialogContent, DialogHeader, DialogTitle };