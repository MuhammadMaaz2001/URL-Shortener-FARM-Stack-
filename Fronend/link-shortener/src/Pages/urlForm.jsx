import React from 'react';

const URLForm = ({ url, setUrl, handleSubmit, loading }) => {
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="url"
        placeholder="Enter your URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition-all duration-300"
        disabled={loading}
      >
        {loading ? "Shortening..." : "Shorten URL"}
      </button>
    </form>
  );
};

export default URLForm;
