import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Tag, Users } from "lucide-react";
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
      duration: 0.2,
      type: "spring",
    },
  },
};

function OurServices() {
  const services = [
    {
      id: 1,
      title: "Buy Books",
      description: "Find the books you need around your neighbourhood.",
      icon: <ShoppingCart className="w-10 h-10" />,
    },
    {
      id: 2,
      title: "Sell Books",
      description:
        "List your books for sell or donated to the local community.",
      icon: <Tag className="w-10 h-10" />,
    },

    {
      id: 3,
      title: "Community",
      description: "Building the community to enable book reusability",
      icon: <Users className="w-10 h-10" />,
    },
  ];

  return (
    <motion.div
      className="py-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-share font-bold mb-4">
            Our Services
          </h2>
          <p className="text-bookworm-gray max-w-2xl mx-auto">
            Sell or donate your old book to the people nearby your locality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl  mx-auto">
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="border-gray-200 border-2 rounded-2xl shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <Card className="text-center border-0 shadow-none">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="mb-4 p-3 rounded-full bg-gray-100 text-orange-700">
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
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default OurServices;
