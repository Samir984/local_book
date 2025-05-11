import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Tag, Gift, Users } from "lucide-react";

function OurServices() {
  const services = [
    {
      id: 1,
      title: "Buy Books",
      description:
        "Find pre-loved books at great prices from sellers in your area or worldwide. Browse through thousands of titles across all genres.",
      icon: <ShoppingCart className="w-10 h-10" />,
    },
    {
      id: 2,
      title: "Sell Books",
      description:
        "List your books for sale easily. Set your price, add photos and description, and connect with potential buyers instantly.",
      icon: <Tag className="w-10 h-10" />,
    },
    {
      id: 3,
      title: "Donate Books",
      description:
        "Donate your books to those who need them most. Support schools, libraries, and community centers through our platform.",
      icon: <Gift className="w-10 h-10" />,
    },
    {
      id: 4,
      title: "Community",
      description:
        "Connect with fellow book lovers, share reviews, recommendations, and discuss your favorite titles.",
      icon: <Users className="w-10 h-10" />,
    },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-share font-bold mb-4">
            Our Services
          </h2>
          <p className="text-bookworm-gray max-w-2xl mx-auto">
            LocalBook offers a variety of services to enhance your book buying
            and selling experience. Whether you're looking to buy, sell, or
            donate books, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {services.map((service) => (
            <Card
              key={service.id}
              className="text-center  hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-4 flex flex-col items-center">
                <div className="mb-4 p-3 rounded-full   bg-gray-100 text-orange-700">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OurServices;
