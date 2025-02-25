
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  QrCode as QrCodeIcon, 
  Calendar as CalendarIcon, 
  BarChart2 as BarChartIcon, 
  Dumbbell,
  LucideIcon
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

const features: Feature[] = [
  {
    title: "Workout Plans",
    description: "Create and manage your custom workout routines",
    icon: Dumbbell,
    path: "/workout-plan",
  },
  {
    title: "Digital Membership",
    description: "Access your membership card and QR code instantly",
    icon: QrCodeIcon,
    path: "/scanner",
  },
  {
    title: "Book Classes",
    description: "Browse and book fitness classes",
    icon: CalendarIcon,
    path: "/classes",
  },
  {
    title: "Track Progress",
    description: "Monitor your gym visits and achievements",
    icon: BarChartIcon,
    path: "/track-progress",
  },
];

export const Features = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link to={feature.path}>
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-all h-full"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};
