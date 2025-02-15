
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><span className="font-semibold">Name:</span> John Doe</p>
                <p><span className="font-semibold">Email:</span> john@example.com</p>
                <p><span className="font-semibold">Membership Status:</span> Active</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gym Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p><span className="font-semibold">Visits this month:</span> 12</p>
              <p><span className="font-semibold">Last visit:</span> Yesterday</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
