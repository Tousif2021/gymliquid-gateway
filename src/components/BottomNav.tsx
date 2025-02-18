
import { useNavigate, useLocation } from "react-router-dom";
import { Home, QrCode, Calendar, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Home",
      icon: Home,
      path: "/dashboard",
    },
    {
      label: "Digital Pass",
      icon: QrCode,
      path: "/scanner",
    },
    {
      label: "Classes",
      icon: Calendar,
      path: "/classes",
    },
    {
      label: "Profile",
      icon: UserCircle,
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-lg shadow-lg">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full relative",
                "text-muted-foreground hover:text-primary transition-colors",
                isActive && "text-primary"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className={cn(
                "text-xs transition-all",
                isActive ? "font-bold" : "font-medium"
              )}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
