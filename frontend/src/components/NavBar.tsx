import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Book } from "lucide-react";
import { useMobileNav } from "@/hooks/useMobileNav";

const Navbar = () => {
  const isMobile = useMobileNav();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="max-w-[1340px] mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <Book className="w-8 h-8 text-orange-700 text-bookworm-burgundy" />
            <div>
              <h1 className="text-xl sm:text-2xl font-noto font-medium text-bookworm-primary leading-tight">
                LocalBook <br />
              </h1>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link
              to="/books"
              className="text-bookworm-gray hover:text-bookworm-primary px-3 py-2 text-sm font-medium"
            >
              Browse Books
            </Link>
            <Link
              to="/sell"
              className="text-bookworm-gray hover:text-bookworm-primary px-3 py-2 text-sm font-medium"
            >
              Sell Books
            </Link>

            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-bookworm-primary hover:text-bookworm-secondary focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/books"
                className="block px-3 py-2 rounded-md text-base font-medium text-bookworm-primary hover: "
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Books
              </Link>
              <Link
                to="/sell"
                className="block px-3 py-2 rounded-md text-base font-medium text-bookworm-primary hover: "
                onClick={() => setIsMenuOpen(false)}
              >
                Sell Books
              </Link>

              <div className="flex space-x-2 mt-4">
                <Link to="/signin" className="w-1/2">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" className="w-1/2">
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
