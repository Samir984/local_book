import { Input } from "./ui/input";
import { Newspaper, Search, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Badge } from "./ui/badge";

export default function BookFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [name, setName] = useState(searchParams.get("name") || "");
  const [publication, setPublication] = useState(
    searchParams.get("publication") || ""
  );

  const updateQuery = (name: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    const d = newParams.getAll("name");
    console.log(d);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const deleteFilter = () => {
    const newParams = new URLSearchParams();
    newParams.set("bookType", "is_any");
    setSearchParams(newParams);
    setPublication("");
  };

  const getQueryValue = (paramName: string) =>
    searchParams.get(paramName) || "";

  return (
    <div className="w-full flex flex-col px-4 py-6 bg-white shadow-md">
      <h2 className="text-center text-lg font-medium text-gray-800 mb-4 ">
        {" "}
        Book Filter
      </h2>
      <div className="flex flex-col gap-6 relative">
        {searchParams.size >= 2 && (
          <div
            className="flex gap-1 border-gray-300 border-2 w-fit justify-center items-center px-2 py-1 absolute -top-11 right-0 hover:text-red-500 hover:bg-gray-100 duration-300 transition-all"
            onClick={deleteFilter}
          >
            <span className="text-sm font-medium">Clear filter</span>
            <X size={16} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Search Book</span>
          <div className="relative ">
            <div
              className="absolute right-0  flex justify-center items-center h-full  bg-orange-800 w-10 cursor-pointer"
              onClick={() => updateQuery("name", name.toLowerCase())}
            >
              <Search
                color="white"
                size={20}
                className="   text-white  h-full"
              />
            </div>
            <Input
              type="text"
              className="pr-20  "
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search book .."
            />
            {name && (
              <X
                className="absolute top-[5px] p-1  rounded-full bg-gray-100 text-black right-[50px] cursor-pointer"
                onClick={() => {
                  setName(""); // Clear the input field
                  updateQuery("name", null); // Clear the URL param
                }}
              />
            )}
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Category</span>
          <div className="relative">
            <X
              className={`absolute top-2 p-1 rounded-full bg-gray-100 text-black right-2 cursor-pointer ${getQueryValue("category") === "" && "hidden"}`}
              onClick={() => updateQuery("category", null)}
            />
            <Select
              value={getQueryValue("category")}
              onValueChange={(value) => updateQuery("category", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXTBOOK">Text Book</SelectItem>
                <SelectItem value="REFERENCE">Reference Book</SelectItem>
                <SelectItem value="GUIDEBOOK">Guide Book</SelectItem>
                <SelectItem value="SOLUTION">Solution</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Condition */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Condition</span>
          <div className="relative">
            <X
              className={`absolute top-2 p-1 rounded-full bg-gray-100 text-black right-2 cursor-pointer ${getQueryValue("condition") === "" && "hidden"}`}
              onClick={() => updateQuery("condition", null)}
            />
            <Select
              value={getQueryValue("condition")}
              onValueChange={(value) => updateQuery("condition", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LIKE NEW">Like New</SelectItem>
                <SelectItem value="GOOD">Good</SelectItem>
                <SelectItem value="MODERATE">Moderate</SelectItem>
                <SelectItem value="POOR">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Publication */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Publication</span>

            {publication && (
              <Badge
                onClick={() =>
                  updateQuery("publication", publication.toLowerCase())
                }
                className="hover:cursor-pointer relative hover:text-red-600 bg-gray-100 hover:bg-gray-200 duration-300 transition-all"
                variant="outline"
              >
                Apply
              </Badge>
            )}
          </div>
          <div className="relative">
            <X
              className={` top-2 p-1 rounded-full bg-gray-100 text-black right-2 absolute  cursor-pointer ${publication === "" ? "hidden" : ""}`}
              onClick={() => {
                updateQuery("publication", null);
                setPublication("");
              }}
            />
            <Input
              placeholder="Publication"
              type="text"
              value={publication}
              onChange={(e) => setPublication(e.target.value)}
            />
          </div>
        </div>

        {/* Edition */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Edition</span>
          <div className="relative">
            <X
              className={`absolute top-2 p-1 rounded-full bg-gray-100 text-black right-2 cursor-pointer ${getQueryValue("edition") === "" && "hidden"}`}
              onClick={() => updateQuery("edition", null)}
            />
            <Input
              placeholder="Edition"
              type="number"
              value={getQueryValue("edition")}
              onChange={(e) => updateQuery("edition", e.target.value)}
            />
          </div>
        </div>

        {/* Book type */}
        <div className="">
          <div className="relative">
            <fieldset className="border-2 border-gray-200 p-2 ">
              <legend>Book type</legend>
              <RadioGroup
                value={getQueryValue("bookType")}
                className="flex  gape-2 flex-wrap"
                onValueChange={(value) => updateQuery("bookType", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="is_any"
                    id="is_any"
                    className="border-2 border-black w-5 h-5 rounded-full"
                  />
                  <Label htmlFor="is_any">Any</Label>
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
            </fieldset>
          </div>
        </div>

        {/* Sort by */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Sort by</span>
          <div className="relative">
            <X
              className={`absolute top-2 p-1 rounded-full bg-gray-100 text-black right-2 cursor-pointer ${getQueryValue("sortBy") === "" && "hidden"}`}
              onClick={() => updateQuery("sortBy", null)}
            />
            <Select
              value={getQueryValue("sortBy")}
              onValueChange={(value) => updateQuery("sortBy", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Low to heigh</SelectItem>
                <SelectItem value="dex">high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
