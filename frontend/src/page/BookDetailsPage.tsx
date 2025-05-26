import ModalPopover from "@/components/ModelPopOver";
import ReportForm from "@/components/ReportForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";

import {
  RemoveBookMarkItemScehma,
  useCoreApiCreateBookmark,
  useCoreApiGetBook,
  useCoreApiRemoveBookmarkItem,
} from "@/gen";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

import {
  BookmarkIcon,
  BookmarkMinus,
  BookmarkPlus,
  Flag,
  LoaderIcon,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function BookDetailsPage() {
  const { isLoggedIn } = useAuth();

  const navigate = useNavigate();
  const [openReportModal, setOpenReportModal] = useState(false);
  const { bookId } = useParams();
  const queryClient = useQueryClient();

  const addBookMark = useCoreApiCreateBookmark({
    mutation: {
      onSuccess: () => {
        toast.success("Book mark addedd successfully");
        // inValidate all catch
        queryClient.invalidateQueries();
      },
      onError: () => {},
    },
    client: {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken")!,
        "Content-Type": " application/json",
      },
    },
  });

  const removeBookMark = useCoreApiRemoveBookmarkItem({
    mutation: {
      onSuccess: () => {
        toast.success("Book mark remove successfully");
        // inValidate all catch
        queryClient.invalidateQueries();
      },
      onError: () => {},
    },
    client: {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken")!,
        "Content-Type": " application/json",
      },
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: book,
    isLoading,
    isFetching,
  } = useCoreApiGetBook(Number(bookId));

  const onBookMarkChange = function () {
    if (!isLoggedIn) {
      navigate("/login");
    }
    const payload: RemoveBookMarkItemScehma = {
      book_id: book?.id as number,
    };
    if (book?.is_bookmarked === true) {
      removeBookMark.mutate({ data: payload });
    } else if (book?.is_bookmarked === false) {
      addBookMark.mutate({ data: payload });
    }
  };
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
        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <LoaderIcon className="animate-spin h-6 w-6 mr-2" />
            <span>Loading ...</span>
          </div>
        ) : (
          <div className="flex justify-center flex-wrap gap-4 items-center">
            <div className="bg-white flex flex-col gap-2 justify-center border-2 border-gray-200 shadow-sm duration-300 transition-all  p-4">
              <div className=" p-4 min-w-96  min-h-96  rounded-lg flex justify-center items-center ">
                <img
                  src={book?.book_image}
                  alt={book?.name}
                  className="w-full  rounded-md"
                />
              </div>

              <div className="  text-center">
                <Badge className="bg-orange-700 mx-auto">
                  {Number(book?.price) <= 0
                    ? "Donate"
                    : `Rs. ${Number(book?.price).toFixed(2)}`}
                </Badge>
              </div>
            </div>
            <div className="flex-1  bg-white p-4">
              <div className="bg-white p-4 rounded-lg mx-auto border-3 border-gray-200 md:min-w-96 h-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold line-clamp-2 ">
                    {book?.name}
                  </h3>
                  <div className="flex  items-center gap-4">
                    {book?.is_sold && (
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-red-600 hover:bg-red-100 "
                      >
                        {book.is_sold && "Not Avilable"}
                      </Badge>
                    )}
                    {book?.is_bookmarked && (
                      <BookmarkIcon className="fill-orange-600" />
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-red-500 cursor-pointer"
                            onClick={() => setOpenReportModal(true)}
                          >
                            <Flag />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black p-2 rounded-md border border-gray-200 shadow-md">
                          <p>Report this book</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {openReportModal && (
                      <ModalPopover
                        isOpen={openReportModal}
                        closePopOver={() => setOpenReportModal(false)}
                      >
                        <ReportForm
                          bookId={book?.id as number}
                          closeModal={() => setOpenReportModal(false)}
                        />
                      </ModalPopover>
                    )}
                  </div>
                </div>
                <p className="text-lg text-bookworm-gray mb-4">
                  by {book?.user.first_name} {book?.user.last_name}
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-bookworm-gray">{book?.description}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-center mb-2 gap-2">
                    <Badge
                      variant="outline"
                      className={`bg-gray-100 text-gray-600 hover:bg-gray-200 ${book?.category === "POOR" && "text-red-600"}`}
                    >
                      {book?.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`bg-gray-100 text-green-600 hover:bg-gray-200 ${book?.category === "POOR" && "text-red-600"}`}
                    >
                      {book?.condition}
                    </Badge>

                    {book?.grade && (
                      <Badge
                        variant="outline"
                        className={`bg-gray-100 text-green-600 hover:bg-gray-200 ${book?.category === "POOR" && "text-red-600"}`}
                      >
                        {book?.grade}
                      </Badge>
                    )}
                  </div>
                </div>
                <hr className="border-1 my-2 border-gray-100 " />

                <div className="mb-8">
                  <h3 className="font-semibold mb-3">Owner Information</h3>
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-lg shadow-2xl flex justify-center items-center text-lg font-medium bg-orange-700 text-white">
                      {book?.user?.first_name === ""
                        ? book.user.username[0].toUpperCase()
                        : book?.user.first_name[0].toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">
                        {book?.user.first_name} {book?.user.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="py-1 mt-2">
                    <div className="flex gap-2 flex-col  items-start">
                      <div className="flex gap-2 items-center">
                        <span className="font-medium text-lg">Location:</span>
                        <MapPin className="h-4 w-4 " />
                        <span className="font-medium">
                          {book?.user.location}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="font-medium text-lg">
                          Phone Number:
                        </span>
                        <Phone className="h-4 w-4 " />
                        <span className="font-medium">
                          {book?.user.phone_number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with Seller
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onBookMarkChange}
                    disabled={isFetching}
                  >
                    {book?.is_bookmarked ? (
                      <>
                        <BookmarkMinus className="mr-2 h-4 w-4" />
                        Remove Bookmark
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="mr-2 h-4 w-4" />
                        Add Bookmark
                      </>
                    )}
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
