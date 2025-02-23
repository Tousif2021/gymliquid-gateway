
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type WorkoutPlansRow = Database["public"]["Tables"]["workout_plans"]["Row"];

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface WorkoutPlan {
  id?: string;
  name: string;
  exercises: Exercise[];
  user_id: string;
  created_at?: string;
}

export default function WorkoutPlan() {
  const { user } = useAuth();
  const [newPlan, setNewPlan] = useState<WorkoutPlan>({
    name: "",
    exercises: [],
    user_id: user?.id || "",
  });

  const { data: workoutPlans, refetch } = useQuery({
    queryKey: ["workout-plans", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", user?.id);
      
      // Transform the data from JSON to our Exercise type
      return (data || []).map((plan: WorkoutPlansRow) => ({
        ...plan,
        exercises: plan.exercises as Exercise[]
      }));
    },
  });

  const createPlan = useMutation({
    mutationFn: async (plan: WorkoutPlan) => {
      // Convert the plan to the format Supabase expects
      const supabasePlan = {
        name: plan.name,
        user_id: plan.user_id,
        exercises: plan.exercises as unknown as Json
      };

      const { data, error } = await supabase
        .from("workout_plans")
        .insert(supabasePlan)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
      setNewPlan({ name: "", exercises: [], user_id: user?.id || "" });
    },
  });

  const addExercise = () => {
    setNewPlan({
      ...newPlan,
      exercises: [
        ...newPlan.exercises,
        { name: "", sets: 3, reps: 10, weight: 0 },
      ],
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Workout Plan Builder</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Plan Name"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            />
            
            {newPlan.exercises.map((exercise, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Exercise Name"
                  value={exercise.name}
                  onChange={(e) => {
                    const exercises = [...newPlan.exercises];
                    exercises[index].name = e.target.value;
                    setNewPlan({ ...newPlan, exercises });
                  }}
                />
                <Input
                  type="number"
                  placeholder="Sets"
                  value={exercise.sets}
                  onChange={(e) => {
                    const exercises = [...newPlan.exercises];
                    exercises[index].sets = Number(e.target.value);
                    setNewPlan({ ...newPlan, exercises });
                  }}
                />
                <Input
                  type="number"
                  placeholder="Reps"
                  value={exercise.reps}
                  onChange={(e) => {
                    const exercises = [...newPlan.exercises];
                    exercises[index].reps = Number(e.target.value);
                    setNewPlan({ ...newPlan, exercises });
                  }}
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    const exercises = newPlan.exercises.filter((_, i) => i !== index);
                    setNewPlan({ ...newPlan, exercises });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex gap-2">
              <Button onClick={addExercise} variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Add Exercise
              </Button>
              <Button onClick={() => createPlan.mutate(newPlan)}>
                <Save className="w-4 h-4 mr-2" /> Save Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workoutPlans?.map((plan: WorkoutPlan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.exercises.map((exercise, index) => (
                  <li key={index}>
                    {exercise.name} - {exercise.sets}x{exercise.reps}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
