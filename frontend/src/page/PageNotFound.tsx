import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-8 rounded-lg shadow-lg text-gray-800">
      <div className="text-9xl font-extrabold text-red-500 mb-4 animate-bounce">
        404
      </div>
      <h1 className="text-5xl font-bold mb-4 text-center">
        Oops! Page Not Found
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        It seems you've ventured a bit too far out of the grid.
      </p>
      <Link to="/" className="text-blue-600 hover:text-blue-700 text-lg">
        ← Back to Home
      </Link>
    </div>
  );
}
