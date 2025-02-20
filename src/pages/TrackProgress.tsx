
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, Dumbbell, Flame, Scale } from "lucide-react";

const TrackProgress = () => {
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

  const { data: latestBMI } = useQuery({
    queryKey: ["latest-bmi", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bmi_records")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500", bg: "bg-blue-50" };
    if (bmi < 25) return { category: "Normal", color: "text-green-500", bg: "bg-green-50" };
    if (bmi < 30) return { category: "Overweight", color: "text-orange-500", bg: "bg-orange-50" };
    return { category: "Obese", color: "text-red-500", bg: "bg-red-50" };
  };

  if (loading || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Gym Activity & Progress</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Scale className="w-5 h-5 mr-2" />
                BMI Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestBMI ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current BMI</p>
                    <p className="text-2xl font-bold">{latestBMI.bmi.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      getBMICategory(latestBMI.bmi).color} ${getBMICategory(latestBMI.bmi).bg}`}>
                      {getBMICategory(latestBMI.bmi).category}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">
                      {new Date(latestBMI.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  No BMI records yet. Visit FitAdvisor to calculate your BMI.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Dumbbell className="w-5 h-5 mr-2" />
                Visit Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Visits</p>
                  <p className="text-2xl font-bold">{profile.total_visits || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{profile.visits_this_month || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CalendarDays className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Last Visit</p>
                  <p className="font-medium">
                    {profile.last_visit
                      ? new Date(profile.last_visit).toLocaleString()
                      : "No visits yet"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Duration</p>
                  <p className="font-medium">
                    {profile.average_visit_duration
                      ? `${profile.average_visit_duration} minutes`
                      : "Not tracked yet"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Flame className="w-5 h-5 mr-2" />
                Workout Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Calories Burned</p>
                  <p className="text-2xl font-bold">{profile.calories_burned || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Programs</p>
                  <p className="font-medium">
                    {Array.isArray(profile.completed_programs) 
                      ? profile.completed_programs.length 
                      : 0} programs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Workout Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground">Favorite Times</p>
                <div className="mt-2">
                  {profile.favorite_workout_times ? (
                    <p className="font-medium">Data will appear as you visit</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No data yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrackProgress;
