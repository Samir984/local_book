import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoreApiGetBook } from "@/gen";

import {
  Loader,
  Loader2,
  Loader2Icon,
  LoaderIcon,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useEffect } from "react";

import { Link, useParams } from "react-router-dom";

function BookDetailsPage() {
  const { bookId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const book = useCoreApiGetBook(Number(bookId));

  return (
    <div className="w-full ">
      <div className="max-w-7xl mx-auto py-8 ">
        <div className="mb-4">
          <Link
            to="/books"
            className="text-blue-600 hover:text-blue-700 text-lg"
          >
            ← Back to Books
          </Link>
        </div>
        {book.isFetching ? (
          <div className="flex justify-center items-center min-h-96">
            <LoaderIcon className="animate-spin h-6 w-6 mr-2" />
            <span>Loading ...</span>
          </div>
        ) : (
          <div className="flex justify-center flex-wrap gap-4 items-center">
            <div className="bg-white flex flex-col gap-2 justify-center border-2 border-gray-200 shadow-sm duration-300 transition-all  p-4">
              <div className=" p-4 min-w-96  min-h-96  rounded-lg flex justify-center items-center ">
                <img
                  src={book.data?.book_image}
                  alt={book.data?.name}
                  className="w-full  rounded-md"
                />
              </div>

              <div className="  text-center">
                <Badge className="bg-orange-700 mx-auto">
                  {Number(book.data?.price) <= 0
                    ? "Donate"
                    : `Rs. ${Number(book.data?.price).toFixed(2)}`}
                </Badge>
              </div>
            </div>
            <div className="flex-1  bg-white p-4">
              <div className="bg-white p-4 rounded-lg mx-auto border-3 border-gray-200 md:min-w-96 h-full">
                <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                  {book.data?.name}
                </h1>
                <p className="text-lg text-bookworm-gray mb-4">
                  by {book.data?.user.first_name} {book.data?.user.last_name}
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-bookworm-gray">{book.data?.description}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-center mb-2 gap-2">
                    <Badge
                      variant="outline"
                      className={`bg-gray-100 text-gray-600 hover:bg-gray-200 ${book.data?.category === "POOR" && "text-red-600"}`}
                    >
                      {book.data?.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`bg-gray-100 text-green-600 hover:bg-gray-200 ${book.data?.category === "POOR" && "text-red-600"}`}
                    >
                      {book.data?.condition}
                    </Badge>
                    {book.data?.grade && (
                      <Badge
                        variant="outline"
                        className={`bg-gray-100 text-green-600 hover:bg-gray-200 ${book.data?.category === "POOR" && "text-red-600"}`}
                      >
                        {book.data?.grade}
                      </Badge>
                    )}
                  </div>
                </div>
                <hr className="border-1 my-2 border-gray-100 " />

                <div className="mb-8">
                  <h3 className="font-semibold mb-3">Owner Information</h3>
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-lg shadow-2xl flex justify-center items-center text-lg font-medium bg-orange-700 text-white">
                      {book.data?.user.first_name[0].toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">
                        {book.data?.user.first_name} {book.data?.user.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="py-1 mt-2">
                    <div className="flex gap-2 flex-col  items-start">
                      <div className="flex gap-2 items-center">
                        <span className="font-medium text-lg">Location:</span>
                        <MapPin className="h-4 w-4 " />
                        <span className="font-medium">
                          {book.data?.user.location}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="font-medium text-lg">
                          Phone Number:
                        </span>
                        <Phone className="h-4 w-4 " />
                        <span className="font-medium">
                          {book.data?.user.phone_number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1">
                    Chat with Seller
                    <MessageSquare className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save to Favorites
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDetailsPage;
