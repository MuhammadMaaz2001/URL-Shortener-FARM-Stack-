import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Scissors, Copy, RefreshCw, ExternalLink, X, LinkIcon } from "lucide-react"

function App() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // React Query mutation hook to shorten URL
  const mutation = useMutation({
    mutationFn: async (url) => {
      const response = await axios.post("http://192.168.18.232:8000/shorten", {
        original_url: url,
      })
      return response.data.short_url
    },
    onSuccess: (data) => {
      setShortUrl(data)
    },
    onError: () => {
      alert("Error shortening URL!")
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(url) // Trigger the mutation
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  const shortenAnother = () => {
    setUrl("")
    setShortUrl("")
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-xl opacity-30"></div>
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-xl opacity-30"></div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 w-full text-center transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mr-3">
              <Scissors className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              URL Shortener
            </h1>
          </div>

          {!shortUrl ? (
            <URLForm url={url} setUrl={setUrl} handleSubmit={handleSubmit} loading={mutation.isLoading} />
          ) : (
            <URLResult
              url={url}
              shortUrl={shortUrl}
              copyToClipboard={copyToClipboard}
              shortenAnother={shortenAnother}
              toggleModal={toggleModal}
              copySuccess={copySuccess}
            />
          )}

          {mutation.isError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center justify-center">
              <X className="h-5 w-5 mr-2" />
              Error shortening URL!
            </div>
          )}
        </div>
      </div>

      {isModalOpen && <Modal url={url} toggleModal={toggleModal} />}
    </div>
  )
}

const URLForm = ({ url, setUrl, handleSubmit, loading }) => {
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <LinkIcon className="h-5 w-5" />
        </div>
        <input
          type="url"
          placeholder="Enter your long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-200 p-4 pl-10 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
          required
        />
      </div>
      <button
        type="submit"
        className={`${
          loading
            ? "bg-gray-400"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        } text-white px-6 py-3 rounded-xl w-full transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center font-medium`}
        disabled={loading}
      >
        {loading ? (
          <>
            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            Shortening...
          </>
        ) : (
          <>
            <Scissors className="h-5 w-5 mr-2" />
            Shorten URL
          </>
        )}
      </button>
    </form>
  )
}

const URLResult = ({ url, shortUrl, copyToClipboard, shortenAnother, toggleModal, copySuccess }) => {
  return (
    <div className="animate-fadeIn">
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <div className="mb-4">
          <p className="font-bold text-sm text-gray-500 mb-2 flex items-center">
            <LinkIcon className="h-4 w-4 mr-1" /> YOUR LONG URL
          </p>
          <div className="flex items-center">
            <a
              href={url}
              className="text-left text-sm text-gray-700 hover:text-purple-600 transition-colors duration-300 truncate max-w-[250px]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {url}
            </a>
            <button
              onClick={toggleModal}
              className="ml-2 text-xs text-purple-500 hover:text-purple-700 transition-colors duration-300 flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View
            </button>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm text-gray-500 mb-2 flex items-center">
            <Scissors className="h-4 w-4 mr-1" /> YOUR SHORT URL
          </p>
          <div className="flex items-center justify-between bg-purple-50 p-2 rounded-lg border border-purple-100">
            <a
              href={shortUrl}
              className="text-purple-600 font-medium hover:text-purple-800 transition-colors duration-300 truncate max-w-[200px]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortUrl}
            </a>
            <button
              onClick={copyToClipboard}
              className={`${
                copySuccess ? "bg-green-500" : "bg-purple-500 hover:bg-purple-600"
              } text-white p-2 rounded-lg transition-all duration-300`}
              aria-label="Copy to clipboard"
            >
              {copySuccess ? (
                <div className="flex items-center">
                  <span className="text-xs mr-1">Copied!</span>
                  <Copy className="h-4 w-4" />
                </div>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={shortenAnother}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl w-full transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center font-medium"
      >
        <RefreshCw className="h-5 w-5 mr-2" />
        Shorten Another URL
      </button>
    </div>
  )
}

const Modal = ({ url, toggleModal }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center transition-all duration-500 z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-11/12 md:w-1/2 max-w-lg transition-all duration-500 animate-scaleIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-purple-500" />
            Full URL Details
          </h2>
          <button
            onClick={toggleModal}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <p className="text-sm text-gray-500 mb-2">ORIGINAL URL</p>
          <p className="break-words text-gray-700">{url}</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={toggleModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
