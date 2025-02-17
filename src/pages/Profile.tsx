
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      console.log("Fetching profile for user:", user?.id); // Debug log
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error); // Debug log
        throw error;
      }
      
      console.log("Profile data:", data); // Debug log
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?mode=login");
    }
  }, [user, loading, navigate]);

  const handleNavigateBack = () => {
    navigate("/dashboard");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth?mode=login");
  };

  if (loading || profileLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-4xl p-4">
        <button 
          onClick={handleNavigateBack}
          className="flex items-center text-orange-500 text-2xl mb-8"
        >
          <ArrowLeft className="mr-2" />
          Home
        </button>
        
        <div className="space-y-6">
          <Card className="bg-black border-none">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative cursor-pointer group">
                        <Avatar className="h-32 w-32 border-2 border-gray-700">
                          <AvatarImage 
                            src="/placeholder.svg" 
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gray-700 text-xl">
                            {profile?.first_name?.[0]}
                            {profile?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Camera className="mr-2 h-4 w-4" />
                        Change Photo
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Photo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="text-center space-y-3">
                  <h2 className="text-3xl font-bold text-white">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <div className="inline-block px-4 py-1 rounded bg-blue-500 text-white text-sm font-medium">
                    {profile?.membership_type || "BLUE"}
                  </div>
                  <div className="text-gray-400">
                    Id: {user.id}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
