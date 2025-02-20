
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

type UnitSystem = "metric" | "imperial";

interface BMIRecord {
  id: string;
  weight: number;
  height: number;
  bmi: number;
  unit_system: UnitSystem;
  created_at: string;
}

const FitAdvisor = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [bmi, setBmi] = useState<number | null>(null);

  const { data: bmiRecords, refetch: refetchBmiRecords } = useQuery({
    queryKey: ["bmi-records", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bmi_records")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as BMIRecord[];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?mode=login");
    }
  }, [user, loading, navigate]);

  const calculateBMI = () => {
    if (!height || !weight) return null;
    
    let bmiValue: number;
    if (unitSystem === "metric") {
      const heightInMeters = parseFloat(height) / 100;
      bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
    } else {
      const heightInInches = (parseFloat(height) * 12);
      bmiValue = (703 * parseFloat(weight)) / (heightInInches * heightInInches);
    }
    return parseFloat(bmiValue.toFixed(1));
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500", bg: "bg-blue-50" };
    if (bmi < 25) return { category: "Normal", color: "text-green-500", bg: "bg-green-50" };
    if (bmi < 30) return { category: "Overweight", color: "text-orange-500", bg: "bg-orange-50" };
    return { category: "Obese", color: "text-red-500", bg: "bg-red-50" };
  };

  const getAdvice = (category: string) => {
    switch (category) {
      case "Underweight":
        return "Focus on increasing calorie intake with nutrient-rich foods and incorporate strength training.";
      case "Normal":
        return "Maintain your healthy lifestyle with a balanced diet and regular exercise.";
      case "Overweight":
        return "Consider increasing cardio activities and maintaining a slight calorie deficit.";
      case "Obese":
        return "Focus on gradual weight loss through sustainable diet changes and regular exercise. Consider consulting a healthcare professional.";
      default:
        return "";
    }
  };

  const handleCalculate = async () => {
    const calculatedBMI = calculateBMI();
    if (!calculatedBMI) return;

    setBmi(calculatedBMI);
    
    try {
      await supabase.from("bmi_records").insert({
        user_id: user?.id,
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: calculatedBMI,
        unit_system: unitSystem
      });
      
      refetchBmiRecords();
      
      toast({
        title: "BMI Calculated Successfully",
        description: "Your BMI record has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save BMI record.",
        variant: "destructive",
      });
    }
  };

  const toggleUnitSystem = () => {
    if (unitSystem === "metric") {
      setUnitSystem("imperial");
      if (height) setHeight((parseFloat(height) / 2.54 / 12).toFixed(1));
      if (weight) setWeight((parseFloat(weight) * 2.20462).toFixed(1));
    } else {
      setUnitSystem("metric");
      if (height) setHeight((parseFloat(height) * 30.48).toFixed(1));
      if (weight) setWeight((parseFloat(weight) / 2.20462).toFixed(1));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">FitAdvisor</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>BMI Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={unitSystem === "imperial"}
                onCheckedChange={toggleUnitSystem}
              />
              <Label>Use Imperial Units ({unitSystem === "metric" ? "cm & kg" : "ft & lbs"})</Label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Height {unitSystem === "metric" ? "(cm)" : "(ft)"}</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={unitSystem === "metric" ? "175" : "5.8"}
                />
              </div>

              <div className="space-y-2">
                <Label>Weight {unitSystem === "metric" ? "(kg)" : "(lbs)"}</Label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unitSystem === "metric" ? "70" : "154"}
                />
              </div>
            </div>

            <Button 
              onClick={handleCalculate}
              className="w-full"
              disabled={!height || !weight}
            >
              Calculate BMI
            </Button>

            {bmi && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center p-6 rounded-lg bg-primary/5">
                  <div className="text-4xl font-bold text-primary mb-2">{bmi}</div>
                  <div className="text-sm text-muted-foreground">Your BMI</div>
                </div>

                {(() => {
                  const { category, color, bg } = getBMICategory(bmi);
                  return (
                    <div className={`p-4 rounded-lg ${bg}`}>
                      <div className={`font-semibold ${color} mb-2`}>
                        {category}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getAdvice(category)}
                      </p>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {bmiRecords && bmiRecords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>BMI History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={bmiRecords.slice().reverse()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="created_at"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value: number) => [value.toFixed(1), "BMI"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="bmi"
                      stroke="#9b87f5"
                      strokeWidth={2}
                      dot={{ fill: "#9b87f5" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FitAdvisor;
