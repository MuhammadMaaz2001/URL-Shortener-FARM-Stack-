import React from 'react';

const Modal = ({ url, toggleModal }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center transition-all duration-500">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 transition-all duration-500">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Full Long URL</h2>
        <p className="break-words">{url}</p>
        <button
          onClick={toggleModal}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600 transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
