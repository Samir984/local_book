import BookFilter from "@/components/BookFilter";
import useGeoLocation from "@/hooks/useGeoLocation";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function BrowseBook() {
  const geolocation = useGeoLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    
}, [searchParams]);

  return (
    <div className="px-4 py-6 flex flex-wrap gap-6 h-full">
      <div className="w-96 bg-black flex justify-center  items-center">
        <BookFilter />
      </div>
      <div className="flex-1 bg-amber-200 "></div>
    </div>
  );
}
