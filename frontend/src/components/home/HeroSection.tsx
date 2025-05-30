import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?name=${encodeURIComponent(searchQuery)}`);
    }
  };

  const imageUrl =
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },

    whileHover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  return (
    <div
      className="relative flex items-center justify-center font-roboto h-[600px] py-12 md:py-24"
      style={{
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src={imageUrl}
        alt="Background Preloader"
        className="hidden"
        onLoad={() => setBackgroundImageLoaded(true)}
        onError={() => setBackgroundImageLoaded(true)}
      />

      <div
        className={`absolute inset-0 bg-blue-900 transition-opacity duration-1000 ease-in ${
          backgroundImageLoaded ? "opacity-60" : "opacity-70"
        }`}
      ></div>

      <motion.div
        className="mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-3xl md:text-6xl font-bold mb-6 text-white"
            variants={itemVariants}
          >
            Find Books in Your Neighbourhood
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl mb-8 text-gray-100"
            variants={itemVariants}
          >
            Buy and sell used books locally. Connect with fellow readers, save
            money, and give books a second life.
          </motion.p>

          <motion.form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-8"
            variants={itemVariants}
          >
            <div className="flex flex-row gap-4">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search by title, author, or genre..."
                  className="pl-10 pr-4 py-6 rounded-lg w-full bg-white text-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-800" />
              </div>
              <Button
                type="submit"
                className="bg-orange-700 hover:bg-amber-700 active:bg-amber-700  text-white font-bold px-8 py-6"
              >
                Search
              </Button>
            </div>
          </motion.form>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={containerVariants}
          >
            <motion.div variants={buttonVariants} whileHover="whileHover">
              <Button
                variant="default"
                className="bg-white text-black border border-gray-200 hover:bg-gray-100 transition-all duration-200 px-4 py-2 font-medium shadow-sm"
                onClick={() => navigate("/books")}
              >
                Browse All Books
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="whileHover">
              <Button
                variant="default"
                className="bg-white text-black border border-gray-200 hover:bg-gray-100 transition-all duration-200 px-4 py-2 font-medium shadow-sm"
                onClick={() => navigate("/sell")}
              >
                Sell Your Books
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
