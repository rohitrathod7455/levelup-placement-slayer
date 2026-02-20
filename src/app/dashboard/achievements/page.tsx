import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { achievements } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock } from "lucide-react";

export default function AchievementsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold font-headline tracking-tighter mb-6">Achievements</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {achievements.map(ach => (
          <Card key={ach.id} className={cn(
            "flex flex-col items-center text-center transition-all",
            ach.unlocked ? "border-primary/50 bg-primary/10" : "bg-card/50"
          )}>
            <CardHeader>
              <div className={cn(
                "text-6xl mb-4 transition-transform",
                ach.unlocked ? "grayscale-0" : "grayscale"
              )}>
                {ach.icon}
              </div>
              <CardTitle className="font-headline">{ach.title}</CardTitle>
              <CardDescription>{ach.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto w-full">
                {ach.unlocked ? (
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary">
                        <CheckCircle2 className="w-4 h-4"/>
                        <span>Unlocked</span>
                    </div>
                ) : (
                     <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                        <Lock className="w-4 h-4"/>
                        <span>Locked</span>
                    </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
