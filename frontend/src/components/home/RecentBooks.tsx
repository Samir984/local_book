import { Link } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";

function RecentBook() {
  // Take a subset of genres for the featured section

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">
          Recent Listings
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* {featuredGenres.map((genre) => (
            <Link key={genre} to={`/books?genre=${encodeURIComponent(genre)}`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6 text-center">
                  <h3 className="font-medium text-lg">{genre}</h3>
                </CardContent>
              </Card>
            </Link>
          ))} */}
        </div>

        <div className="text-center mb-12">
          <Link to="/books">
            <Button className="bg-blue-950">View All Books</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecentBook;
