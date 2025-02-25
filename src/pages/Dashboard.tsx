
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NutritionCarousel } from "@/components/ui/NutritionCarousel";
import { useToast } from "@/components/ui/use-toast";
import { Welcome } from "@/components/dashboard/Welcome";
import { Stats } from "@/components/dashboard/Stats";
import { Features } from "@/components/dashboard/Features";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading, error } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");
      console.log("Fetching profile for user:", user.id);
      
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        throw fetchError;
      }
      
      if (!existingProfile) {
        console.log("No profile found, creating new profile");
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            display_name: user.email?.split('@')[0] || "Member",
            membership_status: "active",
            membership_type: "Basic",
            role: "member",
            membership_since: new Date().toISOString(),
            membership_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            visits_this_month: 0,
            total_visits: 0
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          throw createError;
        }

        return newProfile;
      }

      return existingProfile;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?mode=login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Profile query error:", error);
      toast({
        title: "Error loading profile",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
      
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    }
  }, [error, toast, queryClient, user?.id]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

        <Welcome name={profile?.first_name || profile?.display_name} />

        <div className="container mx-auto px-4 py-8">
          <Stats 
            loading={authLoading || profileLoading}
            lastVisit={profile?.last_visit}
            membershipStatus={profile?.membership_status}
          />

          <Features />
          
          <div className="mt-8">
            <NutritionCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
