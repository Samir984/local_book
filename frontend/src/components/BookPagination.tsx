import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function BookPagination({
  totalPage,
  currentPage,
  setPage,
}: {
  totalPage: number;
  currentPage: number;
  setPage: (page: number) => void;
}) {
  const handlePreviousPage = function () {
    if (currentPage <= 1) return;
    setPage(currentPage - 1);
  };
  const handleNextPage = function () {
    if (currentPage >= totalPage) return;
    setPage(currentPage + 1);
  };


  const handleMenstionPage = function (page: number) {
    if (page > totalPage) return;
    setPage(page);
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`${currentPage <= 1 ? "disable cursor-not-allowed" : ""}`}
            onClick={handlePreviousPage}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className={`${currentPage > totalPage ? "disable cursor-not-allowed" : ""}`}
            onClick={() => handleMenstionPage(currentPage)}
            isActive
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className={`${currentPage + 1 > totalPage ? "disable cursor-not-allowed" : ""}`}
            onClick={() => handleMenstionPage(currentPage + 1)}
          >
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            className={`${currentPage + 2 > totalPage ? "disable cursor-not-allowed" : ""}`}
            onClick={() => handleMenstionPage(currentPage + 2)}
          >
            {currentPage + 2}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className={`${currentPage >= totalPage ? "disable cursor-not-allowed" : ""}`}
            onClick={handleNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
