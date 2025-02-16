
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { QrCode as QrCodeIcon, Calendar as CalendarIcon, BarChart as BarChartIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?mode=login");
    }
  }, [user, loading, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  const features = [
    {
      title: "Digital Membership",
      description: "Access your membership card and QR code instantly",
      icon: QrCodeIcon,
      onClick: () => navigate("/scanner"),
    },
    {
      title: "Book Classes",
      description: "Browse and book fitness classes",
      icon: CalendarIcon,
      onClick: () => navigate("/classes"),
    },
    {
      title: "Track Progress",
      description: "Monitor your gym visits and achievements",
      icon: BarChartIcon,
      onClick: () => navigate("/profile"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}</h1>
          <p className="text-muted-foreground">Access all your fitness features here</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="p-6 cursor-pointer hover:shadow-lg transition-all"
                onClick={feature.onClick}
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
