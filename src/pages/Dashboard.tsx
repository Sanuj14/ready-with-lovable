import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  Clock, 
  Users, 
  BookOpen, 
  CheckSquare, 
  Award,
  TrendingUp,
  Calendar,
  Star
} from "lucide-react";

const Dashboard = () => {
  const userStats = {
    name: "Alex Chen",
    role: "Student",
    level: "Safety Champion",
    points: 850,
    nextLevelPoints: 1000,
    lessonsCompleted: 12,
    checklistsFinished: 3,
    badgesEarned: 5,
    streak: 7
  };

  const recentActivity = [
    { action: "Completed Earthquake Preparedness Quiz", time: "2 hours ago", points: 50 },
    { action: "Finished Fire Safety Checklist", time: "1 day ago", points: 75 },
    { action: "Earned 'Quick Learner' Badge", time: "3 days ago", points: 100 },
    { action: "Completed Tornado Awareness Lesson", time: "5 days ago", points: 40 }
  ];

  const badges = [
    { name: "First Steps", description: "Completed first lesson", earned: true },
    { name: "Fire Safety Pro", description: "Mastered fire safety", earned: true },
    { name: "Earthquake Expert", description: "Earthquake preparedness complete", earned: true },
    { name: "Quick Learner", description: "Completed 5 lessons in one day", earned: true },
    { name: "Community Helper", description: "Shared knowledge with others", earned: true },
    { name: "Safety Champion", description: "Complete all emergency types", earned: false },
  ];

  const progressData = [
    { type: "Earthquake", completed: 5, total: 5, percentage: 100 },
    { type: "Fire Safety", completed: 4, total: 4, percentage: 100 },
    { type: "Flood", completed: 1, total: 3, percentage: 33 },
    { type: "Tornado", completed: 2, total: 3, percentage: 67 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {userStats.name}! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Continue your disaster preparedness journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-emergency text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm">Total Points</p>
                  <p className="text-3xl font-bold">{userStats.points}</p>
                </div>
                <Trophy className="h-8 w-8" />
              </div>
              <div className="mt-4">
                <div className="text-xs text-primary-foreground/80 mb-1">
                  Progress to {userStats.level} Level
                </div>
                <Progress 
                  value={(userStats.points / userStats.nextLevelPoints) * 100} 
                  className="bg-white/20"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Lessons Completed</p>
                  <p className="text-3xl font-bold text-foreground">{userStats.lessonsCompleted}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                +2 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Checklists Done</p>
                  <p className="text-3xl font-bold text-foreground">{userStats.checklistsFinished}</p>
                </div>
                <CheckSquare className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                4 total available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Current Streak</p>
                  <p className="text-3xl font-bold text-foreground">{userStats.streak}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-warning" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                days in a row
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress by Emergency Type */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
                <CardDescription>
                  Your completion status across all emergency types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {progressData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground">{item.type}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.completed}/{item.total} lessons
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-3" />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">{item.percentage}% complete</span>
                      {item.percentage === 100 && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Mastered
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-foreground text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant="outline" className="text-primary">
                        +{activity.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Badges & Achievements */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Badges Earned
                </CardTitle>
                <CardDescription>
                  {userStats.badgesEarned} of {badges.length} badges unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border text-center ${
                        badge.earned 
                          ? 'bg-accent border-accent-foreground/20' 
                          : 'bg-muted border-muted-foreground/20 opacity-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {badge.earned ? '🏆' : '🔒'}
                      </div>
                      <div className="text-xs font-medium text-foreground">
                        {badge.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {badge.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>
                  Pick up where you left off
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Continue Flood Safety Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Complete Tornado Checklist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="font-medium text-warning text-sm">
                      National Preparedness Month
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Complete any lesson to earn a special badge
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="font-medium text-primary text-sm">
                      Virtual Fire Drill
                    </div>
                    <div className="text-xs text-muted-foreground">
                      School-wide drill next Friday
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;