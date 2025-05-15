import BookCard from "@/components/BookCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoreApiGetBookmark } from "@/gen";

export default function BookMark() {
  const { data: bookmarks, isFetching } = useCoreApiGetBookmark({
    query: {
      staleTime: 30 * 1000,
    },
  });
  console.log(bookmarks);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl text-gray-800 font-medium">My BookMarks</h1>
      <div className="mt-6">
        {isFetching ? (
          <div className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full max-w-[320px] h-90 mb-4 bg-gray-300"
                />
              ))}
          </div>
        ) : bookmarks?.bookmark_item.length === 0 ? (
          <div className="mt-24 w-full flex items-center justify-center flex-col">
            <p className="text-xl font-semibold text-gray-500">
              No bookmarks found 📚
            </p>
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
