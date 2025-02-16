
import { useNavigate, useLocation } from "react-router-dom";
import { Home, QrCode, Calendar, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-lg">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full",
              "text-muted-foreground hover:text-primary transition-colors",
              location.pathname === item.path && "text-primary"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
