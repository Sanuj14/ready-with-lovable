import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DisasterCard from "@/components/DisasterCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Lessons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchLessons();
  }, [user, navigate]);

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Group lessons by disaster type for display
      const groupedLessons = data.reduce((acc: any, lesson: any) => {
        if (!acc[lesson.disaster_type]) {
          acc[lesson.disaster_type] = {
            type: lesson.disaster_type,
            lessons: []
          };
        }
        acc[lesson.disaster_type].lessons.push(lesson);
        return acc;
      }, {});

      setLessons(Object.values(groupedLessons));
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const disasters = [
    {
      title: "Earthquake Preparedness",
      description: "Learn how to prepare for and respond to earthquakes in your school and community.",
      type: "earthquake",
      lessonCount: 5,
      checklistItems: 12,
      completedBy: 234
    },
    {
      title: "Fire Safety & Evacuation",
      description: "Essential fire safety skills and evacuation procedures for students and teachers.",
      type: "fire",
      lessonCount: 4,
      checklistItems: 8,
      completedBy: 189
    },
    {
      title: "Flood Emergency Response", 
      description: "Understanding flood risks and emergency response strategies for your area.",
      type: "flood",
      lessonCount: 3,
      checklistItems: 10,
      completedBy: 156
    },
    {
      title: "Tornado Safety Protocols",
      description: "Tornado awareness and safety protocols for severe weather emergencies.",
      type: "tornado",
      lessonCount: 3,
      checklistItems: 7,
      completedBy: 123
    }
  ];

  const stats = [
    { label: "Total Lessons", value: "15", icon: BookOpen, color: "text-primary" },
    { label: "Active Students", value: "1,247", icon: Users, color: "text-secondary" },
    { label: "Certificates Earned", value: "702", icon: Award, color: "text-warning" },
    { label: "Avg. Completion", value: "18min", icon: Clock, color: "text-primary" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Disaster Preparedness Lessons
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn essential safety skills through interactive lessons designed for students and educators.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Content */}
        <Card className="mb-8 bg-gradient-emergency text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">🚨 Featured: National Preparedness Month</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              September is National Preparedness Month! Complete any lesson to earn a special badge.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" size="lg">
              Get Started Now
            </Button>
          </CardContent>
        </Card>

        {/* Disaster Types Grid */}
        {loading ? (
          <div className="text-center py-8">Loading lessons...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {disasters.map((disaster, index) => {
              // Find the first lesson for this disaster type to use its ID
              const disasterLessons = lessons.find(l => l.type === disaster.type);
              const firstLessonId = disasterLessons?.lessons[0]?.id;
              
              return (
                <DisasterCard
                  key={index}
                  {...disaster}
                  type={firstLessonId || disaster.type}
                />
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to become a preparedness champion?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of students who have already started their safety education journey.
          </p>
          <Button variant="hero" size="lg">
            Start Your First Lesson
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Lessons;