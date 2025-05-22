import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { coreApiReportBook } from "@/gen";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function ReportForm({
  bookId,
  closeModal,
}: {
  bookId: number;
  closeModal: () => void;
}) {
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(reason.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await coreApiReportBook(
        {
          book_id: bookId,
          reason: reason,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        }
      );
      toast.success(res.detail);

      setIsSubmitting(false);
      closeModal();
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);

      // @ts-ignore
      toast.error(err.response.data.detail || "Something went wrong");
    }

    console.log(e);
  };
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Report Book</h3>
      <p className="text-gray-600 mb-4">
        Please provide a reason for reporting this book.
      </p>
      <form>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full h-24 p-2 border border-gray-300 rounded-md"
          placeholder="Type your reason here..."
        />
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            className="ml-2"
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || reason.length <= 0}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
