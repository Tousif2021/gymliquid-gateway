import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, AlertCircle, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Scanner = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [qrValue, setQrValue] = useState("");
  const [isQRLoaded, setIsQRLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?mode=login");
    }
  }, [user, loading, navigate]);

  const generateQRValue = (userId: string, timestamp: number) => {
    return `${userId}_${timestamp}`;
  };

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        const timestamp = Date.now();
        setQrValue(generateQRValue(user.id, timestamp));
      }, 1000);

      setTimeout(() => setIsQRLoaded(true), 800);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-primary/10 rounded-lg" />
          <div className="h-64 w-64 bg-primary/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isActive = profile?.membership_status === "active";
  const membershipExpiry = profile?.membership_expiry ? new Date(profile.membership_expiry) : null;
  const daysUntilExpiry = membershipExpiry ? Math.ceil((membershipExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  const expiryProgress = daysUntilExpiry > 0 ? (30 - daysUntilExpiry) / 30 * 100 : 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4"
    >
      <div className="container mx-auto max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key="qr-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden border-0 shadow-lg bg-card/95 backdrop-blur-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
              
              <CardHeader className="px-8 py-6">
                <CardTitle className="text-center flex items-center justify-center gap-2 text-2xl">
                  {isActive ? (
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      Digital Membership Pass
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-[#4CAF50]" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <>
                      Membership Inactive
                      <AlertCircle className="text-destructive w-6 h-6" />
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex flex-col items-center px-8 pb-8">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-72 h-72 bg-white rounded-2xl shadow-xl flex items-center justify-center p-6 mb-8"
                >
                  {isActive ? (
                    <>
                      {!isQRLoaded && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-2xl"
                        />
                      )}
                      <QRCodeSVG
                        value={qrValue}
                        size={240}
                        level="H"
                        includeMargin={true}
                        className={cn(
                          "rounded-xl transition-all duration-300",
                          isQRLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        )}
                      />
                    </>
                  ) : (
                    <QrCode className="w-20 h-20 text-destructive opacity-50" />
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full space-y-6"
                >
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold tracking-tight">
                      {profile?.display_name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      Member ID: {user.id.slice(0, 8)}
                    </p>
                  </div>

                  <div className="space-y-4 bg-primary/5 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status</span>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-semibold",
                        isActive 
                          ? "bg-[#F2FCE2] text-[#4CAF50]"
                          : "bg-destructive/10 text-destructive"
                      )}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    
                    {membershipExpiry && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Expires</span>
                          <span>{format(membershipExpiry, "MMM dd, yyyy")}</span>
                        </div>
                        <Progress value={expiryProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center font-medium">
                          {daysUntilExpiry} days remaining
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 text-center text-sm text-muted-foreground font-medium px-6"
                >
                  {isActive
                    ? "Show this QR code at the gym entrance for access"
                    : "Please contact support to activate your membership"}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Scanner;
