import BookCard from "@/components/BookCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthProvider";
import { useCoreApiGetBookmark } from "@/gen";
import { BookmarkX } from "lucide-react";
import { Link } from "react-router-dom";

export default function BookMark() {
  const { isLoggedIn } = useAuth();
  const { data: bookmarks, isFetching } = useCoreApiGetBookmark({
    query: {
      enabled: isLoggedIn,
      staleTime: 30 * 1000,
    },
  });

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl text-gray-800 font-medium">My BookMarks</h1>

      <div className="mt-6">
        {isFetching ? (
          <div className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full max-w-[320px] h-90 mb-4 bg-gray-300"
                />
              ))}
          </div>
        ) : bookmarks?.bookmark_item?.length === 0 || !isLoggedIn ? (
          <div className="w-full flex items-center justify-center flex-col">
            <div className=" flex items-center justify-center flex-col p-6 bg-white  ">
              <BookmarkX className="w-20 h-20 text-gray-400 mb-6" />
              <p className="text-2xl font-semibold text-gray-600 mb-4 text-center">
                No bookmarks found!.
              </p>
              <p className="text-lg text-gray-500 mb-8 text-center max-w-md">
                It looks like you haven't added any books to your bookmarks.
              </p>
              <Link
                to="/books"
                className="text-blue-600 hover:text-blue-700 text-lg"
              >
                ← Explore Books
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {bookmarks?.bookmark_item?.map((book) => (
              <BookCard book={book.book} key={book.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
