import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import URLForm from "./Pages/urlForm";
import URLResult from "./Pages/urlResult";
import Modal from "./Components/modal";

const App = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // React Query mutation hook to shorten URL
  const mutation = useMutation({
    mutationFn: async (url) => {
      const response = await axios.post("http://localhost:8000/shorten", {
        original_url: url,
      });
      return response.data.short_url;
    },
    onSuccess: (data) => {
      setShortUrl(data);
    },
    onError: () => {
      alert("Error shortening URL!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(url); // Trigger the mutation
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      alert("URL copied to clipboard!");
    });
  };

  const shortenAnother = () => {
    setUrl("");
    setShortUrl("");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 transition-all duration-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center transition-all duration-500">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">URL Shortener</h1>
        <URLForm
          url={url}
          setUrl={setUrl}
          handleSubmit={handleSubmit}
          loading={mutation.isLoading}
        />
        {mutation.isError && <p className="text-red-500 mb-4">Error shortening URL!</p>}
        {shortUrl && (
          <URLResult
            url={url}
            shortUrl={shortUrl}
            copyToClipboard={copyToClipboard}
            shortenAnother={shortenAnother}
            toggleModal={toggleModal}
          />
        )}
      </div>
      {isModalOpen && <Modal url={url} toggleModal={toggleModal} />}
    </div>
  );
};

export default App;
