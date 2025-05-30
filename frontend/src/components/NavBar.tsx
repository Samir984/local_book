import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { LucideBookmark, Menu, X } from "lucide-react";
import { useMobileNav } from "@/hooks/useMobileNav";
import { useAuth } from "@/context/AuthProvider";
import { Skeleton } from "./ui/skeleton";
import Profile from "./Profile";
import Logo from "./Logo";

function Navbar() {
  const isMobile = useMobileNav();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoading, isLoggedIn, user } = useAuth();

  return (
    <nav className="bg-white shadow-md py-3 sticky top-0 z-40 ">
      <div className="max-w-[1440px] mx-auto  px-1 md:px-4">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}

          <Link to="/" className="flex items-center space-x-2">
            <div className="h-12 w-[1px]"></div>
            <Logo />
          </Link>

          {/* Navigation NavLinks - Desktop */}
          <div className="hidden md:flex md:space-x-0 lg:space-x-6  items-center">
            <NavLink
              to="/books"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? "text-orange-700"
                    : "text-gray-700 hover:text-orange-700"
                }`
              }
            >
              Browse Books
            </NavLink>
            <NavLink
              to="/sell"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? "text-orange-700"
                    : "text-gray-700 hover:text-orange-700"
                }`
              }
            >
              Sell Books
            </NavLink>
            <NavLink
              to="/mybooks"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? "text-orange-700"
                    : "text-gray-700 hover:text-orange-700"
                }`
              }
            >
              My Books
            </NavLink>

            <NavLink
              to="/bookmarks"
              className={({ isActive }) =>
                `px-3 py-2 flex gap-[1px] text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? "text-orange-700"
                    : "text-gray-700 hover:text-orange-700"
                }`
              }
            >
              <LucideBookmark size={20} />
              <span>Bookmark</span>
            </NavLink>
            {isLoading ? (
              <Skeleton className="w-9 h-9 rounded-lg bg-gray-300" />
            ) : (
              <div>
                {isLoggedIn ? (
                  <Profile user={user} />
                ) : (
                  <div className="flex gap-2  overflow-hidden">
                    <NavLink to="/login">
                      <Button variant="outline">Sign In</Button>
                    </NavLink>
                    <NavLink to="/register">
                      <Button>Register</Button>
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex  gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className=" hover:text-bookworm-secondary focus:outline-none  "
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
            {isLoading ? (
              <Skeleton className="w-12 h-12 rounded-full bg-gray-300 " />
            ) : (
              <div className="transition-opacity duration-500 ease-in-out opacity-100">
                {isLoggedIn ? (
                  <Profile user={user} />
                ) : (
                  <div className="flex gap-2">
                    <NavLink to="/login">
                      <Button variant="outline">Sign In</Button>
                    </NavLink>
                    <NavLink to="/register">
                      <Button>Register</Button>
                    </NavLink>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="p-2 flex flex-col border-[1px] bg-gray-100">
              <NavLink
                to="/books"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 active:bg-gray-200 ${
                    isActive
                      ? "text-orange-700"
                      : "text-gray-700 hover:text-orange-700"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Books
              </NavLink>
              <NavLink
                to="/sell"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 active:bg-gray-200 ${
                    isActive
                      ? "text-orange-700"
                      : "text-gray-700 hover:text-orange-700"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Sell Books
              </NavLink>
              <NavLink
                to="/mybooks"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 active:bg-gray-200 ${
                    isActive
                      ? "text-orange-700"
                      : "text-gray-700 hover:text-orange-700"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                My Books
              </NavLink>
              <NavLink
                to="/bookmarks"
                className={({ isActive }) =>
                  `px-3 py-2 flex  gap-[2px] text-sm font-medium rounded-md transition-all duration-200 active:bg-gray-200 ${
                    isActive
                      ? "text-orange-700"
                      : "text-gray-700 hover:text-orange-700"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Bookmarks</span>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
