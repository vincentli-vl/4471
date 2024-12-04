import React from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-1/2 h-1/2 p-6 text-black">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">
          &times; {/* Close button */}
        </button>
        {children} {/* Modal content */}
      </div>
    </div>
  );
};

export default Modal;
