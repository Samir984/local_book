import { Link } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-blue-950 via-blue-900 to-blue-800 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Logo & About */}
          <div className="md:col-span-1">
            <Logo />
            <p className="text-sm text-gray-300 mt-4 leading-relaxed">
              A platform that enables the reusability of used books. We connect
              buyers and sellers of used books within their local neighborhoods.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-serif font-semibold mb-4  pb-1">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", to: "/" },
                { name: "Browse Books", to: "/books" },
                { name: "Sell Books", to: "/sell" },
                { name: "About Us", to: "/about" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-300 hover:text-white transition duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-serif font-semibold mb-4  pb-1">
              Help & Support
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Terms of Service", to: "/terms" },
                { name: "Privacy Policy", to: "/privacy" },
                { name: "Contact Us", to: "/contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-300 hover:text-white transition duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-700 mt-10 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} LocalBook Local Finds. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
