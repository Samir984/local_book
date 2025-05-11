import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BookIcon } from "lucide-react";
import { PublicBookScehma } from "@/gen";

interface BookCardProps {
  book: PublicBookScehma;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link to={`/books/${book.id}`}>
      <Card className=" h-full flex flex-col min-w-[320px] duration-300 hover:shadow-md hover:-translate-y-1 transition-all">
        <div className="relative pt-[56.25%] bg-bookworm-light">
          <img
            src={book.book_image}
            alt={book.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <Badge className="absolute top-2 right-2  bg-orange-700">
            {Number(book.price) <= 0
              ? "Donate"
              : `Rs. ${Number(book.price).toFixed(2)}`}
          </Badge>
        </div>
        <CardContent className="px-4 flex-grow flex flex-col">
          <h3 className="text-xl font-semibold line-clamp-2 ">{book.name}</h3>

          {book.distance && book.distance !== "None" && (
            <div className="text-base font-medium mt-1 text-green-600 ">
              {Number(book.distance.trim().replace("m", "")).toFixed(2)} m away
              you
            </div>
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
                        ? "Collage"
                        : book.is_bachlore_book
                          ? "Bachlore"
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
            <div className="flex justify-between items-center mt-3  border-t border-gray-100">
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
    </Link>
  );
};

export default BookCard;
