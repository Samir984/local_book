import { Link } from "react-router-dom";
import { Book } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Book className="w-6 h-6 text-white" />
              <h2 className="text-xl font-serif font-bold">LocalBook</h2>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              Connecting book lovers in local neighborhoods. Buy and sell used
              books with people near you.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-serif font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/books"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Browse Books
                </Link>
              </li>
              <li>
                <Link
                  to="/sell"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Sell Books
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-serif font-semibold mb-4">
              Help & Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-200">
          <p>
            © {new Date().getFullYear()} LocalBook Local Finds. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
