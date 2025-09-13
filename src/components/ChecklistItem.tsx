import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface ChecklistItemProps {
  text: string;
  completed?: boolean;
  essential?: boolean;
  onToggle?: (completed: boolean) => void;
}

const ChecklistItem = ({ text, completed = false, essential = false, onToggle }: ChecklistItemProps) => {
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleToggle = (checked: boolean) => {
    setIsCompleted(checked);
    onToggle?.(checked);
  };


  return (
    <Card className={`transition-all duration-300 ${isCompleted ? 'bg-accent/50 border-secondary' : 'hover:shadow-card'}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleToggle}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <label 
                className={`text-sm font-medium cursor-pointer ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}
              >
                {text}
              </label>
              <div className="flex items-center space-x-2">
                {essential && (
                  <Badge className="bg-warning/20 text-warning text-xs" variant="secondary">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Essential
                  </Badge>
                )}
                {isCompleted && (
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistItem;