
import { useNavigate, useLocation } from "react-router-dom";
import { Home, QrCode, Calendar, UserCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

const navItems = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Classes", icon: Calendar, path: "/classes" },
  { label: "Digital Pass", icon: QrCode, path: "/scanner" },
  { label: "FitAdvisor", icon: Activity, path: "/fitadvisor" },
  { label: "Profile", icon: UserCircle, path: "/profile" }
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tooltip, setTooltip] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    navigate(path);
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full glass-nav border-t border-white/10 bg-background/60 backdrop-blur-xl shadow-lg z-50">
      <nav className="flex justify-around items-center h-16 mx-auto px-4 max-w-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-full p-2 transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary font-bold scale-105"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-6 w-6 transition-all" />

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
