// src/components/ui/Modal.tsx

import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-1/3 p-6 relative">
        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 transition-colors font-semibold"
            aria-label="Fechar modal"
          >
            X
          </button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
