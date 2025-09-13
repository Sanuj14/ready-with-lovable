import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckSquare, Trophy } from "lucide-react";
import Navigation from "@/components/Navigation";
import ChecklistItem from "@/components/ChecklistItem";

interface ChecklistItemType {
  id: string;
  item_text: string;
  category: string | null;
  is_essential: boolean;
  order_index: number;
  completed?: boolean;
}

interface Checklist {
  id: string;
  title: string;
  description: string | null;
  disaster_type: string;
  items: ChecklistItemType[];
}

const ChecklistDetail = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchChecklist();
  }, [type, user, navigate]);

  const fetchChecklist = async () => {
    try {
      // Fetch checklist
      const { data: checklistData, error: checklistError } = await supabase
        .from('checklists')
        .select(`
          *,
          checklist_items(*)
        `)
        .eq('disaster_type', type as any)
        .eq('is_published', true)
        .single();

      if (checklistError) throw checklistError;

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_checklist_progress')
        .select('checklist_item_id, is_completed')
        .eq('user_id', user!.id);

      const progressMap: Record<string, boolean> = {};
      progressData?.forEach(item => {
        progressMap[item.checklist_item_id] = item.is_completed;
      });

      // Sort items by order_index
      const sortedItems = checklistData.checklist_items.sort(
        (a: any, b: any) => a.order_index - b.order_index
      );

      setChecklist({
        ...checklistData,
        items: sortedItems
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching checklist:', error);
      toast({
        title: "Error",
        description: "Failed to load checklist",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = async (itemId: string, completed: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_checklist_progress')
        .upsert({
          user_id: user.id,
          checklist_item_id: itemId,
          is_completed: completed,
          completed_at: completed ? new Date().toISOString() : null
        });

      if (error) throw error;

      setUserProgress(prev => ({
        ...prev,
        [itemId]: completed
      }));

      // Award points for essential items
      if (completed && checklist) {
        const item = checklist.items.find(item => item.id === itemId);
        if (item?.is_essential) {
          const { data: existingPoints } = await supabase
            .from('user_points')
            .select('total_points')
            .eq('user_id', user.id)
            .single();

          if (existingPoints) {
            await supabase
              .from('user_points')
              .update({
                total_points: existingPoints.total_points + 5
              })
              .eq('user_id', user.id);

            toast({
              title: "Points earned!",
              description: "You earned 5 points for completing an essential item."
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading checklist...</div>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Checklist not found</h1>
            <Button onClick={() => navigate("/checklists")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Checklists
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const completedItems = checklist.items.filter(item => userProgress[item.id]).length;
  const totalItems = checklist.items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/checklists")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checklists
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{checklist.title}</h1>
              <p className="text-muted-foreground mt-2">{checklist.description}</p>
            </div>
            <Badge variant="secondary">
              {checklist.disaster_type.charAt(0).toUpperCase() + checklist.disaster_type.slice(1)}
            </Badge>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{completedItems}/{totalItems} items completed</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Preparedness Checklist
            </CardTitle>
            <CardDescription>
              Check off items as you complete them. Essential items are marked with a star.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {checklist.items.map((item) => (
              <ChecklistItem
                key={item.id}
                text={item.item_text}
                completed={userProgress[item.id] || false}
                essential={item.is_essential}
                onToggle={(completed) => handleItemToggle(item.id, completed)}
              />
            ))}
            
            {progressPercentage === 100 && (
              <div className="mt-8 p-6 bg-gradient-emergency text-primary-foreground rounded-lg text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                <p>You've completed the entire {checklist.title} checklist. You're well prepared!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ChecklistDetail;