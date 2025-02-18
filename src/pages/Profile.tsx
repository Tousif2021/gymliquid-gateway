
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LockIcon, Camera, Trash2, CreditCard, Mail, Phone, CalendarDays, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const Profile = () => {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth?mode=login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string | null) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative cursor-pointer group">
                        <Avatar className="h-24 w-24 bg-primary/10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="text-xl font-semibold text-primary">
                            {getInitials(profile?.first_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
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
                
                <div className="flex flex-col space-y-1">
                  <h2 className="text-2xl font-bold">
                    {profile?.display_name}
                  </h2>
                  <div className="inline-block w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {profile?.membership_status === 'active' ? 'Active' : profile?.membership_status || 'Active'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Membership Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5 text-sm">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">Email:</span>
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">Phone:</span>
                  {profile?.phone_number ? (
                    <span className="text-muted-foreground">{profile.phone_number}</span>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Plus className="w-4 h-4 mr-1" /> Add phone number
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">Member Since:</span>
                  <span className="text-muted-foreground">{formatDate(profile?.membership_since)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold ml-7">Membership Type:</span>
                  <span className="text-muted-foreground capitalize">{profile?.membership_type || "Basic"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold ml-7">Expiry Date:</span>
                  <span className="text-muted-foreground">
                    {profile?.membership_expiry ? formatDate(profile.membership_expiry) : "Auto-renewal"}
                  </span>
                </div>
                <div className="p-3 rounded-lg border-2 border-dashed flex items-center justify-between bg-muted/50">
                  <div>
                    <span className="font-semibold block mb-1">Member ID</span>
                    <span className="text-muted-foreground">{user.id}</span>
                  </div>
                  <LockIcon className="text-muted-foreground h-4 w-4" />
                </div>
                <div className="p-3 rounded-lg border-2 border flex items-center justify-between bg-muted/50">
                  <div>
                    <span className="font-semibold block mb-1">Payment Method</span>
                    <span className="text-muted-foreground">
                      {profile?.payment_method ? "••••" : "Not set up"}
                    </span>
                  </div>
                  <CreditCard className="text-muted-foreground h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
