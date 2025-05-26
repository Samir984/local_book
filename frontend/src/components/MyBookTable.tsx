"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCheck,
  CheckCheckIcon,
  ChevronDown,
  Delete,
  EditIcon,
  MoreHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  coreApiDeleteBook,
  CoreApiListUserBooksQueryParamsFilterByEnum,
  coreApiMarkedAsSold,
  PrivateBookScehma,
  useCoreApiListUserBooks,
} from "@/gen";

import Cookies from "js-cookie";
import EditBookForm from "./EditForm";
import ModalPopover from "./ModelPopOver";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface BookActionsProps {
  book: PrivateBookScehma;
  refetch: () => void;
}

const BookActions: React.FC<BookActionsProps> = ({ book, refetch }) => {
  const [open, setOpen] = React.useState(false);
  const handleModelClose = function () {
    setOpen(false);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2 transition-colors duration-150 ease-in-out hover:bg-gray-200 hover:text-green-600"
            disabled={book.is_sold || !book.is_reviewed}
            onClick={() => {
              async function markedAsSold() {
                try {
                  const res = await coreApiMarkedAsSold(book.id as number, {
                    headers: {
                      "X-CSRFToken": Cookies.get("csrftoken"),
                    },
                  });

                  toast.success(res.detail);
                  refetch();
                } catch (err) {
                  toast.error(
                    // @ts-ignore
                    err.response.data.detail || "Some thing went wrong"
                  );
                }
              }

              markedAsSold();
            }}
          >
            <CheckCheck />
            <span>Mark as sold</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={book.is_sold}
            className="flex gap-2 transition-colors duration-150 ease-in-out hover:bg-gray-200 hover:text-green-600"
            onSelect={() => setOpen(true)}
          >
            <EditIcon />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2 transition-colors duration-150 ease-in-out hover:bg-gray-200 hover:text-orange-700"
            onClick={() => {
              async function deleteBook() {
                try {
                  const res = await coreApiDeleteBook(book.id as number, {
                    headers: {
                      "X-CSRFToken": Cookies.get("csrftoken"),
                    },
                  });

                  toast.success(res.detail);
                  refetch();
                } catch (err) {
                  toast.error(
                    // @ts-ignore
                    err.response.data.detail || "Some thing went wrong"
                  );
                }
              }
              deleteBook();
            }}
          >
            <Delete />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalPopover isOpen={open} closePopOver={handleModelClose}>
        <EditBookForm
          defaultValue={book}
          closePopOver={handleModelClose}
          refetch={refetch}
        />
      </ModalPopover>
    </div>
  );
};

export const columns: ColumnDef<PrivateBookScehma>[] = [
  {
    accessorKey: "name",
    header: () => <div className="px-4">Name</div>,
    cell: ({ row }) => (
      <div className="px-4 font-semibold font-base">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "book_image",
    header: "Image",
    cell: ({ row }) => (
      <a
        href={row.getValue("book_image")}
        className="text-blue-600 hover:text-blue-700 underline"
        target="_"
      >
        View Image
      </a>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right ">Price</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {parseFloat(row.getValue("price")) === 0 ? (
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-blue-100 text-blue-700">
              Donate
            </span>
          ) : (
            `Rs. ${parseFloat(row.getValue("price")).toFixed(2)}`
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right ">Status</div>,
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="text-right font-medium ">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-md ${
              book.is_reviewed && book.is_accepted
                ? "bg-green-100 text-green-700"
                : book.is_reviewed && book.is_rejected
                  ? "bg-red-100 text-red-700"
                  : "bg-orange-100 text-orange-700"
            }`}
          >
            {book.is_reviewed && book.is_accepted
              ? "Accepted"
              : book.is_reviewed && book.is_rejected
                ? "Rejected"
                : "Unreviewed"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "is_sold",
    header: () => <div className="text-right ">Sold</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center flex justify-end font-medium">
          {row.getValue("is_sold") ? (
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-green-100 text-green-700 flex items-center gap-1">
              <CheckCheckIcon className="h-4 w-4" /> sold
            </span>
          ) : (
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-red-100 text-red-700 flex items-center gap-1">
              <X className="h-4 w-4" /> not-sold
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => <div className="text-right ">Category</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("category")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      // @ts-ignore
      const { refetch } = table.options.meta;

      const book = row.original;
      return (
        <div>
          <BookActions book={book} refetch={refetch} />
        </div>
      );
    },
  },
];
const LIMIT = 10;
export function MyBookTable() {
  // const { isLoggedIn } = useAuth();

  const [filters, setFilters] = React.useState("all");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const queryClient = useQueryClient();

  const {
    data: books,
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useCoreApiListUserBooks(
    {
      filter_by: filters as CoreApiListUserBooksQueryParamsFilterByEnum,
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
        staleTime: 1000 * 3,
        queryKey: ["mybooks", page, filters],
      },
    }
  );

  React.useEffect(() => {
    if (isError) {
      queryClient.setQueryData(["mybooks", page], () => {
        return {
          items: [],
          count: 0,
        };
      });
      setPage(1);
      setTotalPage(0);
    }
  }, [isError, page, queryClient]);

  React.useEffect(() => {
    if (!isFetching && books && !isError) {
      setTotalPage(Math.ceil(books.count / LIMIT || 0));
    }
  }, [isFetching, books, isError]);

  const table = useReactTable({
    data: books?.items || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      refetch,
    },
  });

  const handleFilterChange = (filter: string) => {
    setFilters(filter);
    setPage(1);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 ">
        <DropdownMenu>
          <div className="flex  justify-end pr-2 min-w-40   ">
            <div className="flex items-center gap-2  flex-wrap">
              <Button
                onClick={() => handleFilterChange("all")}
                className={`text-black  bg-transparent hover:bg-orange-700 hover:text-white ${filters === "all" ? "bg-orange-700 text-white" : ""}`}
              >
                All
              </Button>
              <Button
                onClick={() => handleFilterChange("sold")}
                className={`text-black  bg-transparent hover:bg-orange-700 hover:text-white ${filters === "sold" ? "bg-orange-700 text-white" : ""}`}
              >
                Sold
              </Button>
              <Button
                onClick={() => handleFilterChange("unreviewed")}
                className={`text-black  bg-transparent hover:bg-orange-700 hover:text-white ${filters === "unreviewed" ? "bg-orange-700 text-white" : ""}`}
              >
                Unreviewed
              </Button>
              <Button
                onClick={() => handleFilterChange("accepted")}
                className={`text-black  bg-transparent hover:bg-orange-700 hover:text-white ${filters === "accepted" ? "bg-orange-700 text-white" : ""}`}
              >
                Accepted
              </Button>
              <Button
                onClick={() => handleFilterChange("rejected")}
                className={`text-black  bg-transparent hover:bg-orange-700 hover:text-white ${filters === "rejected" ? "bg-orange-700 text-white" : ""}`}
              >
                Rejected
              </Button>
            </div>
          </div>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className=""></div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading === true ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  loading ...
                </TableCell>
              </TableRow>
            ) : !isError && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        Count: {books?.count || 0} | Page: {page} of {totalPage}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={totalPage <= page}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
