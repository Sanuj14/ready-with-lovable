import Navigation from "@/components/Navigation";
import ChecklistItem from "@/components/ChecklistItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { useState } from "react";

const Checklists = () => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string, completed: boolean) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: completed
    }));
  };

  const earthquakeItems = [
    {
      id: "eq-1",
      title: "Identify safe spots in each room",
      description: "Find sturdy furniture to take cover under during shaking.",
      priority: "high" as const
    },
    {
      id: "eq-2", 
      title: "Secure heavy furniture and appliances",
      description: "Prevent items from falling and causing injury during an earthquake.",
      priority: "high" as const
    },
    {
      id: "eq-3",
      title: "Create emergency communication plan",
      description: "Designate meeting points and emergency contacts for family.",
      priority: "medium" as const
    },
    {
      id: "eq-4",
      title: "Assemble earthquake emergency kit",
      description: "Include water, food, flashlight, radio, and first aid supplies.",
      priority: "high" as const
    },
    {
      id: "eq-5",
      title: "Practice Drop, Cover, and Hold On",
      description: "Regular drills help build muscle memory for the correct response.",
      priority: "medium" as const
    }
  ];

  const fireItems = [
    {
      id: "fire-1",
      title: "Install smoke detectors",
      description: "Place smoke detectors on every level and test monthly.",
      priority: "high" as const
    },
    {
      id: "fire-2",
      title: "Plan two escape routes",
      description: "Know two ways out of every room in your home or school.",
      priority: "high" as const
    },
    {
      id: "fire-3",
      title: "Designate meeting point",
      description: "Choose a safe location outside where everyone will meet.",
      priority: "medium" as const
    },
    {
      id: "fire-4",
      title: "Keep fire extinguisher accessible",
      description: "Know location and how to operate fire safety equipment.",
      priority: "medium" as const
    }
  ];

  const getCompletionRate = (items: any[]) => {
    const completed = items.filter(item => completedItems[item.id]).length;
    return Math.round((completed / items.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Emergency Preparedness Checklists
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete these essential preparedness tasks to keep yourself and others safe during emergencies.
          </p>
        </div>

        {/* Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Your Preparedness Progress
                </CardTitle>
                <CardDescription>
                  Track your completion across all emergency types
                </CardDescription>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {Object.values(completedItems).filter(Boolean).length}
                </div>
                <div className="text-sm text-muted-foreground">Items Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">4</div>
                <div className="text-sm text-muted-foreground">Emergency Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning mb-2">
                  {Math.round(((Object.values(completedItems).filter(Boolean).length) / (earthquakeItems.length + fireItems.length)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklists Tabs */}
        <Tabs defaultValue="earthquake" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="earthquake">Earthquake</TabsTrigger>
            <TabsTrigger value="fire">Fire</TabsTrigger>
            <TabsTrigger value="flood">Flood</TabsTrigger>
            <TabsTrigger value="tornado">Tornado</TabsTrigger>
          </TabsList>

          <TabsContent value="earthquake" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Earthquake Preparedness</CardTitle>
                    <CardDescription>
                      Essential steps to prepare for seismic activity
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      {earthquakeItems.filter(item => completedItems[item.id]).length} / {earthquakeItems.length} Complete
                    </Badge>
                    <Progress value={getCompletionRate(earthquakeItems)} className="w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {earthquakeItems.map((item) => (
                  <ChecklistItem
                    key={item.id}
                    text={item.title}
                    completed={completedItems[item.id]}
                    essential={item.priority === 'high'}
                    onToggle={(completed) => handleToggle(item.id, completed)}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fire" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Fire Safety</CardTitle>
                    <CardDescription>
                      Critical fire prevention and escape planning
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      {fireItems.filter(item => completedItems[item.id]).length} / {fireItems.length} Complete
                    </Badge>
                    <Progress value={getCompletionRate(fireItems)} className="w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fireItems.map((item) => (
                  <ChecklistItem
                    key={item.id}
                    text={item.title}
                    completed={completedItems[item.id]}
                    essential={item.priority === 'high'}
                    onToggle={(completed) => handleToggle(item.id, completed)}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flood" className="space-y-4">
            <Card className="p-8 text-center">
              <CardContent>
                <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
                <CardTitle className="mb-2">Flood Checklist Coming Soon</CardTitle>
                <CardDescription>
                  We're preparing comprehensive flood preparedness guidelines.
                </CardDescription>
                <Button variant="outline" className="mt-4">
                  Get Notified
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tornado" className="space-y-4">
            <Card className="p-8 text-center">
              <CardContent>
                <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
                <CardTitle className="mb-2">Tornado Checklist Coming Soon</CardTitle>
                <CardDescription>
                  We're preparing comprehensive tornado safety guidelines.
                </CardDescription>
                <Button variant="outline" className="mt-4">
                  Get Notified
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Completion Celebration */}
        {Object.values(completedItems).filter(Boolean).length > 0 && (
          <Card className="mt-8 bg-gradient-safety text-secondary-foreground">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Great Progress!</h3>
              <p className="mb-4">
                You've completed {Object.values(completedItems).filter(Boolean).length} preparedness tasks. 
                Keep going to become fully prepared!
              </p>
              <Button variant="outline" className="bg-background text-foreground">
                Share Achievement
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Checklists;