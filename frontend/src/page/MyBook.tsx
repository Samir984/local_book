import { MyBookTable } from "@/components/MyBookTable";
import { PagedPrivateBookScehma, useCoreApiListUserBooks } from "@/gen";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const LIMIT = 2;
export default function MyBook() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [storeBooks, setStoreBooks] = useState<PagedPrivateBookScehma>({
    count: 0,
    items: [],
  });
  const {
    data: books,
    isFetching,
    isLoading,
    refetch,
  } = useCoreApiListUserBooks(
    {
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
    },
    {
      client: {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken")!,
        },
      },
      query: {
        staleTime: 300,
        queryKey: ["mybooks", page],
      },
    }
  );

  useEffect(() => {
    if (!isFetching && books) {
      setTotalPage(Math.ceil(books.count / LIMIT || 0));
      setStoreBooks(books);
    }
  }, [isFetching, books]);
  console.log(isFetching, isLoading);
  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl text-gray-800 font-medium">My Books</h1>
      <div className="">
        <MyBookTable
          books={storeBooks as PagedPrivateBookScehma}
          page={page}
          totalPage={totalPage}
          setPage={setPage}
          refetch={refetch}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
}
