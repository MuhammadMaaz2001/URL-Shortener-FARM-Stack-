import React from 'react';

const URLResult = ({ url, shortUrl, copyToClipboard, shortenAnother, toggleModal }) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <p className="font-bold text-lg mb-2 text-gray-800">Your Long URL</p>
          <div className="flex items-center">
            <a
              href={url}
              className="break-words text-blue-600 w-4/5 md:w-1/2 hover:text-blue-800 transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {url.length > 50 ? `${url.slice(0, 50)}...` : url}
            </a>
            {url.length > 50 && (
              <button
                onClick={toggleModal}
                className="ml-3 text-sm text-blue-500 hover:text-blue-700 transition-colors duration-300 flex items-start"
              >
                Show More
              </button>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <p className="font-bold text-lg mb-2 text-gray-800">TinyURL</p>
          <a
            href={shortUrl}
            className="break-words text-blue-600 hover:text-blue-800 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortUrl}
          </a>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={copyToClipboard}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300"
        >
          Copy
        </button>
        <button
          onClick={shortenAnother}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Shorten Another
        </button>
      </div>
    </div>
  );
};

export default URLResult;
