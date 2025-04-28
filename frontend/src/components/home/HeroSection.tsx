import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative flex items-center justify-center font-roboto h-[580px]  py-12 md:py-24">
      <div
        className="absolute bg-green
      -900  top-0 left-0 w-full h-full bg-blue-900"
      ></div>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-6xl  font-bold mb-6 text-white">
            Find Books in Your Neighbourhood
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Buy and sell used books locally. Connect with fellow readers, save
            money, and give books a second life.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-row gap-4">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search by title, author, or genre..."
                  className="pl-10 pr-4 py-6 rounded-lg w-full bg-white text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-800 " />
              </div>
              <Button
                type="submit"
                className="bg-bookworm-burgundy hover:bg-opacity-90  bg-red-700 text-white font-bold px-8 py-6"
              >
                Search
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              variant="secondary"
              className="bg-white text-bookworm-primary text-black"
              onClick={() => navigate("/books")}
            >
              Browse All Books
            </Button>
            <Button
              variant="outline"
              className="border-white text-black bg-white hover:text-bookworm-primary"
              onClick={() => navigate("/sell")}
            >
              Sell Your Books
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
