import { useNavigate, useLocation } from "react-router-dom";
import { Home, QrCode, Calendar, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tooltip, setTooltip] = useState<string | null>(null);

  const navItems = [
    { label: "Home", icon: Home, path: "/dashboard" },
    { label: "Digital Pass", icon: QrCode, path: "/scanner" },
    { label: "Classes", icon: Calendar, path: "/classes" },
    { label: "Profile", icon: UserCircle, path: "/profile" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if ("vibrate" in navigator) {
      navigator.vibrate(50); // Haptic feedback for mobile
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full border-t bg-background/90 backdrop-blur-md shadow-lg z-50">
      <nav className="flex justify-around items-center h-16 mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              onMouseEnter={() => setTooltip(item.label)}
              onMouseLeave={() => setTooltip(null)}
              className={cn(
                "relative flex flex-col items-center justify-center w-20 h-full p-2 rounded-xl transition-all",
                isActive
                  ? "bg-background shadow-md text-primary font-bold scale-105"
                  : "text-muted-foreground opacity-70 hover:opacity-100"
              )}
            >
              <item.icon className="h-6 w-6 mb-1 transition-all" />
              <span className="text-xs">{item.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {tooltip === item.label && (
                <div className="absolute bottom-14 bg-black text-white text-xs px-2 py-1 rounded-md shadow-md">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
