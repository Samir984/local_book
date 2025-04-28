import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: "New" | "Like New" | "Very Good" | "Good" | "Fair" | "Poor";
  imageUrl: string;
  description: string;
  genre: string[];
  location: string;
  distance?: string; // e.g. "2.5 miles away"
  seller: {
    id: string;
    name: string;
    rating: number;
    profilePic?: string;
  };
  isbn?: string;
  publishYear?: number;
  publisher?: string;
  language?: string;
  pages?: number;
  format?: "Hardcover" | "Paperback" | "Mass Market" | "eBook" | "Audiobook";
  listedDate: Date | string;
}

export type BookCondition = Book["condition"];
export type BookFormat = NonNullable<Book["format"]>;
interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link to={`/book/${book.id}`}>
      <Card className="book-card h-full flex flex-col">
        <div className="relative pt-[56.25%] ">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-bookworm-burgundy hover:bg-bookworm-burgundy">
            ${book.price.toFixed(2)}
          </Badge>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-bookworm-gray text-sm mb-2">{book.author}</p>

          <div className="flex justify-between items-center mt-auto pt-3">
            <div className="flex items-center text-sm">
              <Badge variant="outline" className="mr-2">
                {book.condition}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-bookworm-gray">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{book.distance}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-bookworm-secondary text-white rounded-full flex items-center justify-center text-xs">
                {book.seller.name.charAt(0)}
              </div>
              <span className="ml-2 text-sm">{book.seller.name}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm">{book.seller.rating}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BookCard;
