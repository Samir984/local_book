import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form"; // Import Control and Resolver
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
  PartialUpdateBookSchemaPatch,
  PrivateBookScehma,
  useCoreApiPartialUpdateBook,
} from "@/gen";

import Cookies from "js-cookie";

// Define your schema

function EditBookForm({
  defaultValue,
  closePopOver,
  refetch,
}: {
  defaultValue: PrivateBookScehma;
  closePopOver: () => void;
  refetch: () => void;
}) {
  const form = useForm({
    defaultValues: {
      name: defaultValue.name,
      price: defaultValue.price,
      category: defaultValue.category,
      condition: defaultValue.condition,
    },
  });

  const EditBookMutation = useCoreApiPartialUpdateBook({
    mutation: {
      onSuccess: (data) => {
        console.log(data);
        toast.success(data.detail);
        form.reset();
        refetch();
        closePopOver();
      },
      onError: (error) => {
        console.log("Error:", error);
        toast.error(
          error.response?.data.detail || `Error: Fail to submit book.`
        );
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
    getValues,
    formState: { errors },
  } = form;

  const onSubmit = async function (data: PartialUpdateBookSchemaPatch) {
    console.log(data);

    console.log(
      defaultValue.category,
      getValues("category"),
      defaultValue.condition,
      getValues("condition"),
      defaultValue.price,
      getValues("price"),
      defaultValue.name,
      getValues("name")
    );
    if (
      defaultValue.category === getValues("category") &&
      defaultValue.condition === getValues("condition") &&
      defaultValue.price === getValues("price") &&
      defaultValue.name === getValues("name")
    ) {
      toast.message("form value is not changed");
      return;
    }
    await EditBookMutation.mutateAsync({
      data,
      id: defaultValue.id as number,
    });
  };

  return (
    <div className="max-w-xl ">
      <div className=" mx-auto px-4">
        <div className=" max-w-7xl  w-full py-8 px-6 rounded-lg">
          <Form {...form}>
            <form
              // @ts-ignore
              onSubmit={handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              {/* Book Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Name</FormLabel>
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
                    <FormLabel>Category</FormLabel>
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

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (RS)</FormLabel>
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
                    <FormLabel>Condition</FormLabel>
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

              {/* Submit Button */}
              <div className="text-right">
                <Button type="submit" disabled={EditBookMutation.isPending}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default EditBookForm;
