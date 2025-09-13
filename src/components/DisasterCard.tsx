import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckSquare, Users } from "lucide-react";

interface DisasterCardProps {
  title: string;
  description: string;
  type: string;
  lessonCount: number;
  checklistItems: number;
  completedBy: number;
}

const DisasterCard = ({ title, description, type, lessonCount, checklistItems, completedBy }: DisasterCardProps) => {
  const typeColors: Record<string, string> = {
    earthquake: "bg-amber-100 text-amber-800",
    fire: "bg-red-100 text-red-800", 
    flood: "bg-blue-100 text-blue-800",
    tornado: "bg-gray-100 text-gray-800"
  };
  
  const getTypeColor = (disasterType: string) => {
    return typeColors[disasterType] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="hover:shadow-elevated transition-all duration-300 transform hover:scale-105">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <Badge className={getTypeColor(type)} variant="secondary">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div className="flex flex-col items-center">
            <BookOpen className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-medium">{lessonCount}</span>
            <span className="text-xs text-muted-foreground">Lessons</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckSquare className="h-5 w-5 text-secondary mb-1" />
            <span className="text-sm font-medium">{checklistItems}</span>
            <span className="text-xs text-muted-foreground">Checklist</span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="h-5 w-5 text-warning mb-1" />
            <span className="text-sm font-medium">{completedBy}</span>
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="default" className="flex-1" asChild>
            <a href={`/lesson/${type}`}>Start Learning</a>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <a href={`/checklist/${type}`}>View Checklist</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisasterCard;