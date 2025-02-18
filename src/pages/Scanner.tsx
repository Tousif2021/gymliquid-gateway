
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, AlertCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

const Scanner = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?mode=login");
    }
  }, [user, loading, navigate]);

  // Function to generate a new QR code value
  const generateQRValue = (userId: string, timestamp: number) => {
    return `${userId}_${timestamp}`;
  };

  // Update QR code every second
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        const timestamp = Date.now();
        setQrValue(generateQRValue(user.id, timestamp));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const isActive = profile?.membership_status === "active";
  const membershipExpiry = profile?.membership_expiry ? new Date(profile.membership_expiry) : null;
  const daysUntilExpiry = membershipExpiry ? Math.ceil((membershipExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  const expiryProgress = daysUntilExpiry > 0 ? (30 - daysUntilExpiry) / 30 * 100 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-md">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary"></div>
          
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              {isActive ? "Digital Membership Pass" : "Membership Inactive"}
              {!isActive && <AlertCircle className="text-destructive w-5 h-5" />}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center">
            <div className="w-64 h-64 bg-white rounded-xl shadow-lg flex items-center justify-center p-4 mb-6">
              {isActive ? (
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="rounded-lg"
                />
              ) : (
                <QrCode className="w-16 h-16 text-destructive opacity-50" />
              )}
            </div>

            <div className="w-full space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium mb-1">
                  {profile?.display_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Member ID: {user.id.slice(0, 8)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Membership Status</span>
                  <span className={isActive ? "text-primary" : "text-destructive"}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                {membershipExpiry && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Expires</span>
                      <span>{format(membershipExpiry, "MMM dd, yyyy")}</span>
                    </div>
                    <Progress value={expiryProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {daysUntilExpiry} days remaining
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isActive
                ? "Show this QR code at the gym entrance"
                : "Please contact support to activate your membership"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Scanner;
