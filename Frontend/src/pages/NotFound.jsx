import { useNavigate } from "react-router-dom";

// 404 Not Found page shown for unknown routes.
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      
      {/* Big 404 */}
      <div className="relative mb-8">
        <h1 className="text-[150px] font-black text-gray-100 leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-2">🔍</div>
            <p className="text-gray-500 font-medium text-sm">Page not found</p>
          </div>
        </div>
      </div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Oops! This page doesn't exist
      </h2>
      <p className="text-gray-500 text-sm text-center max-w-md mb-8">
        The page you're looking for may have been moved, deleted, or never existed. 
        Let's get you back on track.
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-6 py-2.5 rounded-md hover:bg-blue-600 transition-colors font-medium text-sm"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm"
        >
          Go Back
        </button>
      </div>

      {/* Decorative dots */}
      <div className="mt-16 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <div className="w-2 h-2 rounded-full bg-blue-300"></div>
        <div className="w-2 h-2 rounded-full bg-blue-100"></div>
      </div>

    </div>
  );
};

export default NotFound;