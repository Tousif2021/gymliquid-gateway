
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            Welcome to FitPass
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your digital gateway to fitness. Join our community and transform your
            wellness journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => navigate("/auth?mode=login")}
            >
              Sign In
            </Button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-lg bg-white/50 backdrop-blur-sm shadow-lg"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Digital Membership",
    description: "Access your membership card and QR code instantly on your phone",
    icon: QrCodeIcon,
  },
  {
    title: "Book Classes",
    description: "Browse and book fitness classes that fit your schedule",
    icon: CalendarIcon,
  },
  {
    title: "Track Progress",
    description: "Monitor your gym visits and workout achievements",
    icon: BarChartIcon,
  },
];

import { QrCode as QrCodeIcon, Calendar as CalendarIcon, BarChart as BarChartIcon } from "lucide-react";

export default Index;
