import { Link } from "react-router-dom";
import { useState } from "react"; // Import useState

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BookIcon, BookmarkIcon } from "lucide-react";
import { PublicBookScehma } from "@/gen";
import { motion } from "framer-motion";
interface BookCardProps {
  book: PublicBookScehma & { is_sold?: boolean };
}

const BookCard = ({ book }: BookCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Link to={`/books/${book.id}`}>
      <motion.div
        animate={{
          translateY: "0px",
        }}
        initial={{
          translateY: "20px",
        }}
        transition={{
          ease: "easeInOut",
        }}
      >
        <Card
          className={` h-full p-0 pb-1 flex flex-col w-[320px] duration-300 hover:shadow-md hover:-translate-y-1 transition-all ${book.is_sold && "bg-red-50"}`}
        >
          <div
            className={`relative pt-[56.25%] bg-gray-200 overflow-hidden ${
              !imageLoaded ? "animate-pulse-light" : ""
            }`}
          >
            <img
              src={book.book_image}
              alt={book.name}
              className={`absolute top-0 left-[50%] -translate-x-1/2 h-full object-cover  duration-300  `}
              onLoad={handleImageLoad}
              onError={() => {
                setImageLoaded(true);
              }}
            />

            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                Loading Image...
              </div>
            )}

            <Badge className="absolute top-2 right-2 bg-orange-700">
              {Number(book.price) <= 0
                ? "Donate"
                : `Rs. ${Number(book.price).toFixed(2)}`}
            </Badge>
          </div>
          <CardContent className="px-4 pb-2 flex-grow flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold line-clamp-2 ">
                {book.name}
              </h3>
              {book.is_bookmarked && (
                <BookmarkIcon className="fill-orange-600" />
              )}
            </div>

            {book.distance && book.distance !== "None" && (
              <Badge variant="default" className="text-sm mt-1 ">
                {Number(book.distance.trim().replace("m", "")).toFixed(2)} m
                AWAY
              </Badge>
            )}
            <div className="flex justify-between items-center mt-auto pt-3">
              <div className="flex items-center text-sm">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`bg-gray-100 text-green-600 hover:bg-gray-200 ${book.category === "POOR" && "text-red-600"}`}
                  >
                    {book.condition}
                  </Badge>
                  {book.is_sold && (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-red-600 hover:bg-red-100 "
                    >
                      {book.is_sold && "Not Available"}
                    </Badge>
                  )}
                  {(book.is_school_book ||
                    book.is_college_book ||
                    book.is_bachlore_book) && (
                    <Badge
                      variant="outline"
                      className={`bg-gray-100 text-blue-600 hover:bg-gray-200`}
                    >
                      {book.is_school_book
                        ? "School"
                        : book.is_college_book
                          ? "College" // Corrected typo
                          : book.is_bachlore_book
                            ? "Bachelor" // Corrected typo
                            : "null"}
                    </Badge>
                  )}
                  {book.grade && (
                    <Badge
                      className={`bg-gray-100 text-blue-600 hover:bg-gray-200`}
                      variant="outline"
                    >
                      {book?.grade}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                {book.category && (
                  <span className="flex items-center">
                    <BookIcon className="h-4 w-4 " />
                    <span>{book.category}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Owner information */}
            {(book.owner_first_name ||
              book.owner_last_name ||
              book.owner_location) && (
              <div className="flex justify-between items-center mt-3 border-t border-gray-100">
                <div className="flex flex-col text-sm text-bookworm-gray">
                  {(book.owner_first_name || book.owner_last_name) && (
                    <span className="font-medium text-lg">
                      {book.owner_first_name} {book.owner_last_name}
                    </span>
                  )}
                  {book.owner_location && (
                    <span className="flex items-center font-medium gap-2 mt-1 ">
                      <MapPin size={16} />
                      {book.owner_location}
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default BookCard;
