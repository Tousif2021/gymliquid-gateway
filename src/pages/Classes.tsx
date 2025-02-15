
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Classes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Class Schedule</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {classes.map((classItem) => (
            <Card key={classItem.id}>
              <CardHeader>
                <CardTitle>{classItem.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{classItem.description}</p>
                <div className="space-y-2">
                  <p><span className="font-semibold">Time:</span> {classItem.time}</p>
                  <p><span className="font-semibold">Instructor:</span> {classItem.instructor}</p>
                  <Button className="w-full mt-4">Book Class</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const classes = [
  {
    id: 1,
    name: "Yoga Flow",
    description: "Gentle flow yoga suitable for all levels",
    time: "Monday 9:00 AM",
    instructor: "Sarah Johnson"
  },
  {
    id: 2,
    name: "HIIT Training",
    description: "High-intensity interval training for maximum results",
    time: "Tuesday 6:00 PM",
    instructor: "Mike Thompson"
  }
];

export default Classes;
