import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, Trophy, Clock, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string;
  explanation: string | null;
  order_index: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  questions: Question[];
  points_reward: number;
  time_limit_minutes: number | null;
  passing_score: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  disaster_type: string;
  difficulty_level: number;
  points_reward: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  image_url: string | null;
  video_url: string | null;
  pdf_url: string | null;
  simulation_url: string | null;
  quiz?: Quiz;
}

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState<'content' | 'quiz' | 'completed'>('content');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchLesson();
  }, [id, user, navigate]);

  const fetchLesson = async () => {
    try {
      // Fetch lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (lessonError) throw lessonError;

      // Fetch quiz for this lesson
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select(`
          *,
          quiz_questions(*)
        `)
        .eq('lesson_id', id)
        .eq('is_published', true)
        .single();

      if (!quizError && quizData) {
        const sortedQuestions = quizData.quiz_questions.sort((a: any, b: any) => a.order_index - b.order_index);
        (lessonData as any).quiz = {
          ...quizData,
          questions: sortedQuestions
        };
      }

      setLesson(lessonData);
    } catch (error) {
      console.error('Error fetching lesson:', error);
      toast({
        title: "Error",
        description: "Failed to load lesson",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitQuiz = async () => {
    if (!lesson?.quiz || !user) return;

    const quiz = lesson.quiz;
    let score = 0;
    const totalQuestions = quiz.questions.length;

    // Calculate score
    quiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correct_answer) {
        score++;
      }
    });

    const percentage = (score / totalQuestions) * 100;
    const timeSpent = Math.floor((Date.now() - quizStartTime) / 1000);

    try {
      // Save quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: quiz.id,
          score,
          total_questions: totalQuestions,
          percentage,
          answers: quizAnswers,
          time_taken_seconds: timeSpent
        });

      if (attemptError) throw attemptError;

      // Update user progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          is_completed: percentage >= quiz.passing_score,
          time_spent_seconds: timeSpent
        });

      if (progressError) throw progressError;

      // Award points if passed
      if (percentage >= quiz.passing_score) {
        const pointsToAward = lesson.points_reward + quiz.points_reward;
        
        const { error: pointsError } = await supabase
          .from('user_points')
          .upsert({
            user_id: user.id,
            total_points: pointsToAward
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          });

        if (pointsError) {
          // If upsert fails, try to update existing record
          const { data: existingPoints } = await supabase
            .from('user_points')
            .select('total_points')
            .eq('user_id', user.id)
            .single();

          if (existingPoints) {
            await supabase
              .from('user_points')
              .update({
                total_points: existingPoints.total_points + pointsToAward
              })
              .eq('user_id', user.id);
          }
        }
      }

      setCurrentStep('completed');
      
      toast({
        title: percentage >= quiz.passing_score ? "Congratulations!" : "Keep trying!",
        description: `You scored ${score}/${totalQuestions} (${percentage.toFixed(1)}%). ${
          percentage >= quiz.passing_score 
            ? `You earned ${lesson.points_reward + quiz.points_reward} points!` 
            : `You need ${quiz.passing_score}% to pass.`
        }`
      });

    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading lesson...</div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
            <Button onClick={() => navigate("/lessons")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lessons
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = currentStep === 'content' ? 33 : currentStep === 'quiz' ? 66 : 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/lessons")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{lesson.title}</h1>
              <p className="text-muted-foreground mt-2">{lesson.description}</p>
            </div>
            <Badge variant="secondary">
              {lesson.disaster_type.charAt(0).toUpperCase() + lesson.disaster_type.slice(1)}
            </Badge>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {currentStep === 'content' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Lesson Content
              </CardTitle>
              <CardDescription>
                Learn the essential concepts before taking the quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-foreground">
                {lesson.content || "Lesson content coming soon..."}
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <Button 
                  onClick={() => setCurrentStep('quiz')}
                  disabled={!lesson.quiz}
                  className="w-full"
                >
                  {lesson.quiz ? "Take Quiz" : "Quiz Coming Soon"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'quiz' && lesson.quiz && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {lesson.quiz.title}
              </CardTitle>
              <CardDescription>
                {lesson.quiz.description}
                {lesson.quiz.time_limit_minutes && (
                  <span className="ml-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    {lesson.quiz.time_limit_minutes} minutes
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {lesson.quiz.questions.map((question, index) => (
                <div key={question.id} className="border border-border rounded-lg p-4">
                  <h3 className="font-medium mb-4">
                    {index + 1}. {question.question_text}
                  </h3>
                  
                  <div className="space-y-2">
                    {[
                      { value: 'A', text: question.option_a },
                      { value: 'B', text: question.option_b },
                      { value: 'C', text: question.option_c },
                      { value: 'D', text: question.option_d }
                    ].filter(option => option.text).map((option) => (
                      <label 
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-accent rounded"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.value}
                          onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                          className="text-primary"
                        />
                        <span>{option.value}. {option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={submitQuiz}
                disabled={Object.keys(quizAnswers).length < lesson.quiz.questions.length}
                className="w-full"
              >
                Submit Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 'completed' && (
          <Card>
            <CardHeader className="text-center">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Lesson Completed!</CardTitle>
              <CardDescription>
                Great job completing this lesson. Keep up the excellent work!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate("/lessons")}>
                  Back to Lessons
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default LessonDetail;