// components/profile/ProgressSnapshot.tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarCheck,
  Star,
  Code,
  Clock,
} from "lucide-react"; // Icon imports

type SnapshotProps = {
  interviewsTaken: number;
  averageScore: number;
  favoriteTech: string;
  lastActive: string;
};

export default function ProgressSnapshot({
  interviewsTaken,
  averageScore,
  favoriteTech,
  lastActive,
}: SnapshotProps) {
  const data = [
    {
      label: "Interviews Taken",
      value: interviewsTaken,
      icon: <CalendarCheck className="w-5 h-5 text-muted-foreground" />,
    },
    {
      label: "Average Score",
      value: `${averageScore}%`,
      icon: <Star className="w-5 h-5 text-yellow-500" />,
    },
    {
      label: "Favorite Tech",
      value: favoriteTech,
      icon: <Code className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "Last Active",
      value: lastActive,
      icon: <Clock className="w-5 h-5 text-muted-foreground" />,
    },
  ];

  return (
    <section className="mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-4">Progress Snapshot</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item) => (
          <Card key={item.label} className="rounded-2xl shadow-md">
            <CardContent className="p-5 flex flex-col gap-2 items-start justify-center">
              <div className="flex items-center gap-2">
                {item.icon}
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
              <p className="text-xl font-semibold text-primary">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
