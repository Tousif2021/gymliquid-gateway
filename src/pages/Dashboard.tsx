
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { 
  QrCode as QrCodeIcon, 
  Calendar as CalendarIcon, 
  BarChart2 as BarChartIcon, 
  Dumbbell 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { NutritionCarousel } from "@/components/ui/NutritionCarousel";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      if (!data) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user?.id,
            display_name: user?.email?.split('@')[0] || "Member",
            membership_status: "active",
            membership_type: "Basic",
            membership_since: new Date().toISOString(),
            membership_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        return newProfile;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: true
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?mode=login");
    }
  }, [user, authLoading, navigate]);

  const features = [
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

  const formatLastVisit = (date: string | null) => {
    if (!date) return "No visits yet";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const loading = authLoading || profileLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <h1 className="text-6xl font-black text-center py-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-primary to-blue-400 dark:from-blue-400 dark:via-blue-500 dark:to-primary tracking-tight">
            Allstars Training Center
          </h1>
          <div className="absolute -skew-y-3 -z-10 inset-0 bg-gradient-to-r from-blue-500/10 via-primary/10 to-blue-400/10 dark:from-blue-400/20 dark:via-blue-500/20 dark:to-primary/20 blur-xl"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 p-8 rounded-xl bg-gradient-to-r from-primary/15 via-primary/10 to-transparent backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-primary/5 transition-all"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center relative"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-2xl"
            />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Welcome back!
            </h2>
            {loading ? (
              <Skeleton className="h-12 w-48 mx-auto mb-4" />
            ) : (
              <motion.p
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="text-4xl font-semibold bg-gradient-to-r from-primary/90 to-primary/60 bg-clip-text text-transparent"
              >
                {profile?.first_name || profile?.display_name || "Member"}
              </motion.p>
            )}
            <p className="text-muted-foreground mt-4 text-lg">Ready for another great workout? 💪</p>
          </motion.div>
        </motion.div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Visit</p>
                {loading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <p className="font-medium">{formatLastVisit(profile?.last_visit)}</p>
                )}
              </div>
            </Card>

            <Card className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <BarChartIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membership Status</p>
                {loading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <p className="font-medium capitalize">
                    {profile?.membership_status || "Not Active"}
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-4 flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Class</p>
                <p className="font-medium">No upcoming classes</p>
              </div>
            </Card>
          </div>

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
          <div className="mt-8">
            <NutritionCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
