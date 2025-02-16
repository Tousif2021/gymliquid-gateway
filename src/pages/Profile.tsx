
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LockIcon } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {profile?.first_name?.[0]}
                    {profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Update Photo
                </Button>
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                    {profile?.membership_status || "Active"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membership Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Email:</span> {user.email}
                </div>
                <div className="p-4 rounded-lg border-2 border-dashed flex items-center justify-between bg-muted/50">
                  <div>
                    <span className="font-semibold block mb-1">QR Code ID</span>
                    <span className="text-muted-foreground">••••••••{user.id.slice(-4)}</span>
                  </div>
                  <LockIcon className="text-muted-foreground h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gym Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <span className="font-semibold">Visits this month:</span>{" "}
                {profile?.visits_this_month || 0}
              </p>
              <p>
                <span className="font-semibold">Last visit:</span>{" "}
                {profile?.last_visit
                  ? new Date(profile.last_visit).toLocaleDateString()
                  : "No visits yet"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
