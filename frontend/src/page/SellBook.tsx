import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form"; // Import Control and Resolver
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  createBookSchemaCategoryEnum,
  createBookSchemaConditionEnum,
  useCoreApiCreateBook,
} from "@/gen";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import Cookies from "js-cookie";
import { uploadToS3 } from "@/utils/utils";
import { useGeoLocation } from "@/context/GeoLocationProvider";

// Define your schema
const CreateBookSchema = z.object({
  book_image: z.string(),
  name: z.string().min(1, { message: "Book name is required" }),
  category: z.enum([
    createBookSchemaCategoryEnum.TEXTBOOK,
    createBookSchemaCategoryEnum.SOLUTION,
    createBookSchemaCategoryEnum.REFERENCE,
    createBookSchemaCategoryEnum.GUIDEBOOK,
    createBookSchemaCategoryEnum.OTHER,
  ]),
  publication: z.string().optional(),
  edition: z.number().optional(),
  is_school_book: z.boolean().optional(),
  grade: z.number().optional(),
  is_college_book: z.boolean().optional(),
  is_bachlore_book: z.boolean().optional(),
  description: z.string().min(1, { message: "Description is required" }),
  condition: z.enum([
    createBookSchemaConditionEnum["LIKE NEW"],
    createBookSchemaConditionEnum.GOOD,
    createBookSchemaConditionEnum.MODERATE,
    createBookSchemaConditionEnum.POOR,
  ]),
  price: z.number().min(0, "Price cannot be negative."),
});
type CreateBookSchemaType = z.infer<typeof CreateBookSchema>;

function SellBook() {
  const [bookImage, setBookImage] = useState<string | ArrayBuffer | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileNotSetError, setFileNotSetError] = useState(false);
  const [triggerAlertBox, setTriggerAlertBox] = useState(false);
  const geolocation = useGeoLocation();

  const form = useForm<CreateBookSchemaType>({
    resolver: zodResolver(CreateBookSchema),
    defaultValues: {
      book_image: "3",
      name: "red",
      category: "REFERENCE",
      price: 0,
      edition: 1,
      description: "test",
      condition: "GOOD",
    },
  });

  const createBookMutation = useCoreApiCreateBook({
    mutation: {
      onSuccess: (data) => {
        console.log(data);
        toast.success(data.detail);
        form.reset(); // Reset form on successful submission
      },
      onError: (error) => {
        console.log("Error:", error);
        toast.error(`Error: Fail to submit book.`);
      },
    },
    client: {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken")!,
        "Content-Type": " application/json",
      },
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = form;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size > 2097152) {
      toast.error("File not accepted, file size must be less then 2MB");
      return;
    }
    // return;
    if (!file) {
      setBookImage(null);
      setFileNotSetError(true);
      setImageFile(null);
      return;
    }
    setFileNotSetError(false);
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBookImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const watchCategory = watch("category");
  const watchIs_school_book = watch("is_school_book");

  const onSubmit = async function (data: CreateBookSchemaType) {
    if (!imageFile) {
      toast.error("File is not selected");
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setFileNotSetError(true);
      return;
    }
    if (!geolocation) {
      setTriggerAlertBox(true);
      return;
    }
    handleSubmitFormWithGeoLocation(data);
  };

  const handleSubmitFormWithGeoLocation = async function (
    data: CreateBookSchemaType
  ) {
    if (!imageFile) return toast.error("File is not selected");
    try {
      const key = await uploadToS3(imageFile);
      data.book_image = key;

      createBookMutation.mutate({
        data: {
          ...data,
          latitude: geolocation?.latitude,
          longitude: geolocation?.longitude,
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit form");
    }
  };

  const handleSubmitWithoutGeoLocation = async () => {
    const data = getValues();
    if (!imageFile) {
      toast.error("File is not selected");
      return;
    }

    try {
      const key = await uploadToS3(imageFile);
      data.book_image = key;

      createBookMutation.mutate({
        data: {
          ...data,
        },
      });
    } catch (error) {
      console.log(error);
      setTimeout(() => toast.error("Submit failed."), 1000);
    } finally {
      setTriggerAlertBox(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Sell Your Book
        </h1>
        <div className=" max-w-7xl bg-gray-50 w-full py-8 px-6 rounded-lg">
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              {/* Book Images */}
              <FormField
                control={form.control}
                name="book_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="book_image">Book Images *</FormLabel>
                    <FormControl>
                      <div
                        className={cn(
                          "flex flex-col relative items-center justify-center h-96  border-gray-400 border-dashed",
                          "border-2 border-dashed rounded-lg cursor-pointer",
                          "bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700",
                          "hover:bg-gray-100 dark:border-gray-800 dark:hover:border-gray-500",
                          "dark:hover:bg-gray-600",

                          fileNotSetError === true ? "border-red-500" : ""
                        )}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {bookImage ? (
                            <div className="w-60 h-[80%] mb-4 ">
                              <img
                                src={
                                  typeof bookImage === "string" ? bookImage : ""
                                }
                                className="mx-auto inset-0 object-contain rounded-md"
                                alt="book image"
                              />
                            </div>
                          ) : (
                            <UploadCloud className="w-10 h-10 text-gray-400" />
                          )}
                          <div className="mb-2  text-gray-900 dark:text-gray-700">
                            <span className="font-semibold">
                              Click to upload or select an image
                            </span>
                            <p className="text-gray-700 text-center ">
                              {" "}
                              (PNG or JPG format){" "}
                              <strong> & size &lt; 2MB</strong>
                            </p>
                          </div>
                        </div>
                        <Input
                          type="file"
                          id="book_image"
                          accept="image/png, image/jpeg, image/jpg "
                          className="absolute w-full h-full opacity-0 z-50 cursor-pointer"
                          onChange={(e) => {
                            handleImageChange(e);
                            field.onChange(e);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Book Title */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Name *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter book name"
                        {...field}
                        className={cn(
                          "mt-1 block w-full",
                          errors.name &&
                            "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.category &&
                              "border-red-500 focus:ring-red-500 focus:border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TEXTBOOK">Text Book</SelectItem>
                        <SelectItem value="REFERENCE">
                          Reference Book
                        </SelectItem>
                        <SelectItem value="GUIDEBOOK">Guide Book</SelectItem>
                        <SelectItem value="SOLUTION">Solution</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Radio Group */}
              {watchCategory === "TEXTBOOK" && (
                <FormField
                  control={form.control}
                  name="is_school_book"
                  render={() => (
                    <div className="flex flex-wrap justify-between gap-4 border-y-2 py-4">
                      <FormItem>
                        <FormLabel className="gap-1">Book Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            className="flex gap-2 sm:gap-4"
                            onValueChange={(value) => {
                              setValue(
                                "is_school_book",
                                value === "is_school_book"
                              );
                              setValue(
                                "is_college_book",
                                value === "is_collage_book"
                              );
                              setValue(
                                "is_bachlore_book",
                                value === "is_bachelor_book"
                              );
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="is_school_book"
                                id="is_school_book"
                                className="border-2 border-black w-5 h-5 rounded-full"
                              />
                              <Label htmlFor="is_school_book">School</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="is_collage_book"
                                id="is_collage_book"
                                className="border-2 border-black w-5 h-5 rounded-full"
                              />
                              <Label htmlFor="is_collage_book">College</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="is_bachelor_book"
                                id="is_bachelor_book"
                                className="border-2 border-black w-5 h-5 rounded-full"
                              />
                              <Label htmlFor="is_bachelor_book">Bachelor</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class</FormLabel>
                            <Input
                              type="number"
                              disabled={!watchIs_school_book}
                              placeholder="Enter your class "
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsedValue =
                                  value === "" ? 1 : Number(value);

                                field.onChange(parsedValue);
                              }}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                />
              )}

              {/* Publication */}
              <FormField
                control={form.control}
                name="publication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter publication name"
                        {...field}
                        className="mt-1 block w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Edition */}
              <FormField
                control={form.control}
                name="edition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edition</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter book edition "
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;

                          const parsedValue = value === "" ? 1 : Number(value);
                          field.onChange(parsedValue);
                        }}
                        className="mt-1 block w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (RS) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;

                          const parsedValue = value === "" ? 0 : Number(value);
                          field.onChange(parsedValue);
                        }}
                        className={cn(
                          "mt-1 block w-full",
                          errors.price &&
                            "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Condition */}
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.condition &&
                              "border-red-500 focus:ring-red-500 focus:border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LIKE NEW">Like New</SelectItem>
                        <SelectItem value="GOOD">Good</SelectItem>
                        <SelectItem value="MODERATE">Moderate</SelectItem>
                        <SelectItem value="POOR">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder=" Describe the book."
                        {...field}
                        className={cn(
                          "mt-1 block w-full min-h-[100px]",
                          errors.description &&
                            "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="text-right">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${isSubmitting && "bg-red-500"}`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Geo Location Confirmation Alert Dialog */}
        <AlertDialog open={triggerAlertBox} onOpenChange={setTriggerAlertBox}>
          <AlertDialogContent className="">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Submit Form without GeoLocation data ?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-medium text-gray-800">
                <strong className="text-red-800">
                  Your current location data is not set. Please, make sure GPS
                  is on and site has permission to read location.
                </strong>
                <br />
                This information is used to help users nearby discover your
                book. Would you like to proceed with the submission without
                geolocation data?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-green-600 text-white hover:bg-green-700 hover:text-white"
                onClick={() => setTriggerAlertBox(false)}
              >
                No, cancel submission
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleSubmitWithoutGeoLocation}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Yes, continue without location"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default SellBook;
