import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Star, Code, Clock } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";


type SnapshotProps = {
  interviewsTaken: number;
  averageScore: number;
  favoriteTech: string;
  lastActive: string | null;
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
      value: <AnimatedCounter to={interviewsTaken} />,
      icon: <CalendarCheck className="w-5 h-5 text-muted-foreground" aria-hidden />,
    },
    {
      label: "Average Score",
      value: <AnimatedCounter to={averageScore} suffix="%" />,
      icon: <Star className="w-5 h-5 text-yellow-500" aria-hidden />,
    },
    {
      label: "Favorite Tech",
      value: favoriteTech,
      icon: <Code className="w-5 h-5 text-blue-500" aria-hidden />,
    },
    {
      label: "Last Interviewed",
      value: lastActive
        ? new Date(lastActive).toLocaleDateString()
        : "---",
      icon: <Clock className="w-5 h-5 text-muted-foreground" aria-hidden />,
    },
  ];

  return (
    <section className="mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-4">Progress Snapshot</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item) => (
          <Card
            key={item.label}
            className="rounded-2xl shadow-sm border border-muted bg-background"
          >
            <CardContent className="p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {item.icon}
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
              <p className="text-xl font-semibold text-primary">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
