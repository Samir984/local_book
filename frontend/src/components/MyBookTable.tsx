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
import { ChevronDown, MoreHorizontal } from "lucide-react";

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
  PrivateBookScehma,
  useCoreApiListUserBooks,
} from "@/gen";

import Cookies from "js-cookie";
import EditBookForm from "./EditForm";
import ModalPopover from "./ModelPopOver";
import { toast } from "sonner";

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
            className="flex gap-2 hover:bg-gray-100"
            onSelect={() => setOpen(true)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2 hover:bg-gray-100"
            onClick={() => {
              async function deleteBook() {
                await coreApiDeleteBook(book.id as number, {
                  headers: {
                    "X-CSRFToken": Cookies.get("csrftoken"),
                  },
                });
                toast.success("Book deleteSuccessfully by successfull");
                refetch();
              }
              deleteBook();
            }}
          >
            Delete
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
    cell: ({ row }) => <div className="px-4">{row.getValue("name")}</div>,
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
          Rs. {parseFloat(row.getValue("price"))}
        </div>
      );
    },
  },
  {
    accessorKey: "is_reviewed",
    header: () => <div className="text-right ">Status</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue("is_reviewed") && row.getValue("is_accepted")
            ? "Accepted"
            : row.getValue("is_reviewed") && row.getValue("is_rejected")
              ? "Rejected"
              : "Pending"}
        </div>
      );
    },
  },
  {
    accessorKey: "condition",
    header: () => <div className="text-right ">Condition</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue("condition")}
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
const LIMIT = 2;
export function MyBookTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);

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
        staleTime: 1000 * 300,
        queryKey: ["mybooks", page],
      },
    }
  );

  React.useEffect(() => {
    if (!isFetching && books) {
      setTotalPage(Math.ceil(books.count / LIMIT || 0));
    }
  }, [isFetching, books]);

  console.log(books);
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
  console.log(books);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
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
            {isFetching === true ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  loading ...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
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
