import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface ChecklistItemProps {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  completed?: boolean;
  onToggle?: (id: string, completed: boolean) => void;
}

const ChecklistItem = ({ id, title, description, priority, completed = false, onToggle }: ChecklistItemProps) => {
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleToggle = (checked: boolean) => {
    setIsCompleted(checked);
    onToggle?.(id, checked);
  };

  const priorityConfig = {
    high: { color: "bg-emergency text-emergency-foreground", icon: AlertTriangle },
    medium: { color: "bg-warning text-warning-foreground", icon: Info },
    low: { color: "bg-secondary text-secondary-foreground", icon: CheckCircle2 }
  };

  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Card className={`transition-all duration-300 ${isCompleted ? 'bg-accent/50 border-secondary' : 'hover:shadow-card'}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Checkbox
            id={id}
            checked={isCompleted}
            onCheckedChange={handleToggle}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <label 
                htmlFor={id} 
                className={`text-sm font-medium cursor-pointer ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}
              >
                {title}
              </label>
              <div className="flex items-center space-x-2">
                <Badge className={`${config.color} text-xs`} variant="secondary">
                  <Icon className="h-3 w-3 mr-1" />
                  {priority.toUpperCase()}
                </Badge>
                {isCompleted && (
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                )}
              </div>
            </div>
            <p className={`text-sm ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistItem;