import { MyBookTable } from "@/components/MyBookTable";

export default function MyBook() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl text-gray-800 font-medium">My Books</h1>
      <div className="">
        <MyBookTable />
      </div>
    </div>
  );
}
