import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Shield, BookOpen, CheckSquare, Users, Award, ArrowRight, AlertTriangle, Zap, Heart } from "lucide-react";
import heroImage from "@/assets/hero-preparedness.jpg";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Interactive Lessons",
      description: "Engaging content covering earthquake, fire, flood, and tornado preparedness"
    },
    {
      icon: CheckSquare,
      title: "Preparedness Checklists", 
      description: "Step-by-step guides to help you prepare for emergencies"
    },
    {
      icon: Award,
      title: "Progress Tracking",
      description: "Earn badges and track your preparedness journey"
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with other students and educators nationwide"
    }
  ];

  const stats = [
    { label: "Students Trained", value: "12,500+", icon: Users },
    { label: "Schools Participating", value: "150+", icon: Shield },
    { label: "Emergency Types Covered", value: "4", icon: AlertTriangle },
    { label: "Completion Rate", value: "94%", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-emergency text-primary-foreground">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 animate-slide-up">
              Be Prepared. Stay Safe. <br />
              <span className="text-primary-light">Save Lives.</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 animate-slide-up">
              Learn essential disaster preparedness skills through interactive lessons designed for students, 
              teachers, and communities nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/lessons">
                <Button variant="hero" size="lg">
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/checklists">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  View Checklists
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Stay Prepared
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and knowledge you need for emergency preparedness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-elevated transition-all duration-300">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Types Preview */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Prepare for Any Emergency
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive training for the most common natural disasters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Earthquakes", emoji: "🌍", color: "bg-amber-100 text-amber-800" },
              { name: "Fires", emoji: "🔥", color: "bg-red-100 text-red-800" },
              { name: "Floods", emoji: "🌊", color: "bg-blue-100 text-blue-800" },
              { name: "Tornadoes", emoji: "🌪️", color: "bg-gray-100 text-gray-800" }
            ].map((disaster, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{disaster.emoji}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{disaster.name}</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${disaster.color}`}>
                    Training Available
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-safety text-secondary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Zap className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Ready to become a preparedness champion?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students and educators who are already building safer communities 
            through disaster preparedness education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/lessons">
              <Button variant="outline" size="lg" className="bg-white text-secondary hover:bg-white/90">
                Start Learning Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
