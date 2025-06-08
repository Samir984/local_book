import { Card, CardContent } from "@/components/ui/card";
import { Search, Book, Phone } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
    },
  },
};

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
    <motion.div
      className="py-16 "
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-share font-bold mb-4">
            How It Works
          </h2>
          <p className="text-bookworm-gray max-w-2xl mx-auto">
            We provide the platform for book buyers and sellers, making it easy
            to find used books. All transaction details, including payment and
            exchange, are handled directly between members.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="border-gray-200 border-2 shadow-lg hover:-translate-y-1 rounded-2xl transition-all duration-300"
            >
              <Card className="text-center border-0 shadow-none">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="mb-4 p-3 rounded-full bg-gray-100 text-orange-700">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-800 font-inter font-medium">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
