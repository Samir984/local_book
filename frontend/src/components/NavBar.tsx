import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Book, Bookmark, Menu, X } from "lucide-react";
import { useMobileNav } from "@/hooks/useMobileNav";
import { useAuth } from "@/context/AuthProvider";
import { Skeleton } from "./ui/skeleton";
import Profile from "./Profile";

const Navbar = () => {
  const isMobile = useMobileNav();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoading, isLoggedIn, user } = useAuth();

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-4">
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
            <Link
              to="/mybooks"
              className="text-bookworm-gray hover:text-bookworm-primary px-3 py-2 text-sm font-medium"
            >
              My Books
            </Link>

            <Link
              to="/bookmarks"
              className="text-bookworm-gray items-center flex gap-1  hover:text-bookworm-primary px-3 py-2 text-sm font-medium"
            >
              <Bookmark size={20} />
              <span>Bookmark</span>
            </Link>
            {isLoading ? (
              <Skeleton className="w-12 h-12 rounded-full bg-gray-300" />
            ) : isLoggedIn ? (
              <Profile user={user} />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-bookworm-primary hover:text-bookworm-secondary focus:outline-none"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
            <div>
              {isLoading ? (
                <Skeleton className="w-12 h-12 rounded-full bg-gray-300" />
              ) : isLoggedIn ? (
                <Profile user={user} />
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </div>
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
              <Link
                to="/mybooks"
                className="block px-3 py-2 rounded-md text-base font-medium text-bookworm-primary hover: "
                onClick={() => setIsMenuOpen(false)}
              >
                My Books
              </Link>
              <Link
                to="/mybooks"
                className=" flex gap-1 items-center px-3 py-2 rounded-md text-base font-medium text-bookworm-primary hover: "
                onClick={() => setIsMenuOpen(false)}
              >
                <Bookmark />
                <span>Bookmarks</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
