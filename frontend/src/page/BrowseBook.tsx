import BookCard from "@/components/BookCard";
import BookFilter from "@/components/BookFilter";
import { useGeoLocation } from "@/context/GeoLocationProvider";

import { Filter, Search } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { BookPagination } from "@/components/BookPagination";
import {
  BookCategoryChoicesEnum,
  BookConditionChoicesEnum,
  PagedPublicBookScehma,
  PublicBookScehma,
  useCoreApiListBooks,
} from "@/gen";


const LIMIT = 6;

export default function BrowseBook() {
  const { latitude, longitude } = useGeoLocation();
  const [openFilterSideBar, setFilterSideBar] = useState(false);
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(1);

  const {
    data: books,
    isFetching,
    isError,
  } = useCoreApiListBooks(
    {
      name: searchParams.get("name"),
      condition: searchParams.get("condition") as BookConditionChoicesEnum,
      category: searchParams.get("category") as BookCategoryChoicesEnum,
      publication: searchParams.get("publication"),
      edition:
        searchParams.get("edition") === null ||
        searchParams.get("edition") === "0"
          ? null
          : Number(searchParams.get("edition")),
      is_school_book:
        searchParams.get("bookType") === "is_school_book" ? true : null,
      is_college_book:
        searchParams.get("bookType") === "is_collage_book" ? true : null,
      is_bachlore_book:
        searchParams.get("bookType") === "is_bachelor_book" ? true : null,
      grade:
        searchParams.get("grade") === null || searchParams.get("grade") === "0"
          ? null
          : Number(searchParams.get("grade")),
      latitude,
      longitude,
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
    },
    {
      query: {
        staleTime: 1000 * 30,
      },
    }
  );

  function sortByPrice(
    books: PagedPublicBookScehma | undefined,
    sortBy: string | null
  ) {
    if (!sortBy || !books) return books;
    else if (sortBy === "asc") {
      return {
        ...books,
        items: books.items.sort(
          (a: PublicBookScehma, b: PublicBookScehma) =>
            Number(a.price) - Number(b.price)
        ),
        count: books.items.length,
      };
    } else if (sortBy === "desc") {
      return {
        ...books,
        items: books.items.sort(
          (a: PublicBookScehma, b: PublicBookScehma) =>
            Number(b.price) - Number(a.price)
        ),
        count: books.items.length,
      };
    }
  }

  const sortBy = searchParams.get("sortBy");
  const filterBooks = sortByPrice(books, sortBy);


  return (
    <div className="px-4 py-6 flex flex-wrap gap-6 h-full flex-col  sidebar:flex-row relative">
      {/* Desktop Filter */}
      <div className="w-96 sidebar:flex justify-center hidden items-start">
        <BookFilter />
      </div>
      {/* Mobile Filter Toggle */}
      <div
        className="sidebar:hidden w-fit text-lg font-medium flex items-center gap-4 ml-auto p-2 cursor-pointer"
        onClick={() => setFilterSideBar((prev) => !prev)}
      >
        <Filter size={20} />
        <span>Filters</span>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 sidebar:translate-x-full bg-white  z-50 overflow-y-scroll px-4 py-8 shadow-lg transition-transform duration-300 transform ${
          openFilterSideBar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <BookFilter />
      </div>

      {/* Mobile Sidebar Overlay */}
      {openFilterSideBar && (
        <div
          className="fixed sidebar:hidden top-0 left-0 w-full h-full bg-black opacity-50 z-40 "
          onClick={() => setFilterSideBar(false)}
        ></div>
      )}
      {/* Books */}

      <div className="flex-1 w-full  flex item-start flex-col ">
        {isError && (
          <div className="mt-24 w-full flex items-center justify-center text-red-500 flex-col">
            <p className="text-xl font-semibold mb-2">
              Oops! Something went wrong.
            </p>
            <p className="text-red-500">
              We encountered an unexpected error. Please try again later.
            </p>
          </div>
        )}
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
        ) : books?.count === 0 ? (
          <div className="mt-24 w-full flex items-center justify-center flex-col">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-semibold text-gray-500">
              No books found 📚
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filterBooks?.items.map((book) => <BookCard book={book} key={book.id} />)}
          </div>
        )}
        {books && books?.count > 0 && (
          <div className="mt-auto pt-8">
            <BookPagination
              currentPage={page}
              totalPage={books.count / LIMIT}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
