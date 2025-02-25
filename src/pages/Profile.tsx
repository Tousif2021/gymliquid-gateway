import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2, CreditCard, Moon, Sun, Mail, Phone, Calendar, Star, Clock, Copy } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
    retry: false
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?mode=login");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth?mode=login");
  };

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile) {
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setProfileImage(fileUrl);

    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`profile_${user.id}`, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.path);
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", user.id);

      if (error) throw error;

      setProfileImage(null);
      toast({
        title: "Success",
        description: "Profile picture removed successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to remove profile picture",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(user.id).then(() => {
      toast({
        title: "Member ID copied!",
        description: "Your Member ID has been copied to your clipboard.",
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-background/80 backdrop-blur-sm p-4 rounded-lg z-50">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-accent"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="shadow-md rounded-lg">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative cursor-pointer group">
                        <Avatar className="h-24 w-24 bg-primary/10 rounded-full">
                          <AvatarImage src={profileImage || profile?.avatar_url || "/placeholder.svg"} />
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
                      <DropdownMenuItem asChild>
                        <label htmlFor="profile-image-upload" className="flex items-center cursor-pointer">
                          <Camera className="mr-2 h-4 w-4" />
                          Change Photo
                          <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleRemovePhoto} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Photo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-col space-y-1">
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {profile?.display_name}
                  </h2>
                  <div className="inline-block w-fit px-3 py-1 rounded-full bg-[#F2FCE2] text-[#4CAF50] text-sm font-medium">
                    {profile?.membership_status === 'active' ? 'Active' : profile?.membership_status || 'Active'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Membership Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5 text-sm">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4" />
                  <span className="font-semibold">Email:</span>
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4" />
                    <span className="font-semibold">Phone:</span>
                    <span className="text-muted-foreground">
                      {profile?.phone_number || "Not provided"}
                    </span>
                  </div>
                  {!profile?.phone_number && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Phone Number</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            type="tel"
                            placeholder="Enter phone number"
                            id="phone-input"
                          />
                          <DialogFooter>
                            <Button 
                              onClick={async () => {
                                try {
                                  const phoneInput = document.getElementById('phone-input') as HTMLInputElement;
                                  const { error } = await supabase
                                    .from('profiles')
                                    .update({ phone_number: phoneInput.value })
                                    .eq('id', user.id);
                                  
                                  if (error) throw error;

                                  toast({
                                    title: "Success",
                                    description: "Phone number updated successfully"
                                  });
                                  window.location.reload();
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to update phone number",
                                    variant: "destructive"
                                  });
                                }
                              }}
                            >
                              Save
                            </Button>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4" />
                  <span className="font-semibold">Member Since:</span>
                  <span className="text-muted-foreground">{formatDate(profile?.membership_since)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-4 w-4" />
                  <span className="font-semibold">Membership Type:</span>
                  <span className="text-muted-foreground capitalize">{profile?.membership_type || "Basic"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">Expiry Date:</span>
                  <span className="text-muted-foreground">
                    {profile?.membership_expiry ? formatDate(profile.membership_expiry) : <span className="text-green-500">Auto-renewal</span>}
                  </span>
                </div>
                <div className="p-3 rounded-lg border-2 border-dashed flex items-center justify-between bg-muted/50">
                  <div>
                    <span className="font-semibold block mb-1">Member ID</span>
                    <span className="text-muted-foreground">{user.id}</span>
                  </div>
                  <div onClick={handleCopy} className="cursor-pointer hover:text-primary">
                    <Copy className="text-muted-foreground h-4 w-4" />
                  </div>
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
            className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white rounded-lg"
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
