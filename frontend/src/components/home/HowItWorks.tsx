import { Card, CardContent } from "@/components/ui/card";
import { Search, Book, Phone } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Find Books",
      description:
        "Search for books near you by title, publication, edition etc.",
      icon: <Search className="w-10 h-10" />,
    },
    {
      id: 2,
      title: "Connect with Sellers",
      description: "Contact the seller.",
      icon: <Phone className="w-10 h-10" />,
    },
    {
      id: 3,
      title: "Take Books",
      description: "Choose a location to meet or go to the buyer's home.",
      icon: <Book className="w-10 h-10" />,
    },
  ];

  return (
    <div className="py-16 bg-amber-50">
      <div className="mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
            How It Works
          </h2>
          <p className="text-bookworm-gray max-w-2xl mx-auto">
            BookWorm Local Finds makes it easy to buy and sell used books in
            your community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <Card
              key={step.id}
              className="text-center  hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-6 flex flex-col  items-center">
                <div className="mb-4 p-3 rounded-full  bg-gray-100 text-orange-700">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-800 font-inter font-medium">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
