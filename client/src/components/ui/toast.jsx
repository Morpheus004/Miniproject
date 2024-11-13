import React, { useState, useEffect } from 'react';

const ToastContext = React.createContext({
  toast: () => {},
  toasts: [],
  removeToast: () => {}
});

const Toast = ({ id, title, description, duration = 3000, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onRemove]);

  return (
    <div
      className="flex items-center w-full max-w-sm bg-white rounded-lg shadow-lg p-4 mb-4 transform transition-all duration-300 ease-in-out"
      role="alert"
    >
      <div className="ml-3 w-full">
        {title && (
          <div className="font-medium text-gray-900">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm text-gray-500">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, duration }) => {
    const id = Date.now().toString();
    setToasts((prevToasts) => [...prevToasts, { id, title, description, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            duration={toast.duration}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};