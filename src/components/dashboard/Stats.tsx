
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2 as BarChartIcon, Calendar as CalendarIcon, Dumbbell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StatsProps {
  loading: boolean;
  lastVisit: string | null;
  membershipStatus: string;
}

export const Stats = ({ loading, lastVisit, membershipStatus }: StatsProps) => {
  const formatLastVisit = (date: string | null) => {
    if (!date) return "No visits yet";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="p-4 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Dumbbell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Last Visit</p>
          {loading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <p className="font-medium">{formatLastVisit(lastVisit)}</p>
          )}
        </div>
      </Card>

      <Card className="p-4 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <BarChartIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Membership Status</p>
          {loading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <p className="font-medium capitalize">
              {membershipStatus || "Not Active"}
            </p>
          )}
        </div>
      </Card>

      <Card className="p-4 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <CalendarIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Next Class</p>
          <p className="font-medium">No upcoming classes</p>
        </div>
      </Card>
    </div>
  );
};
