import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, Target, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-600 mb-4">
              <span className="text-5xl">🦉</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            OwlNudge
          </h1>
          <p className="text-2xl font-semibold text-blue-600 mb-4">
            Smart Financial Planning for Everyone
          </p>
          <p className="text-xl text-gray-600 mb-8">
            Free, accessible financial guidance powered by AI. Designed for individuals with limited access to traditional banking services. Build your financial future, one step at a time.
          </p>
          <Button 
            size="lg" 
            onClick={handleStartQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Start Your Financial Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            100% free • No bank account required • Available to everyone
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Small, Grow Big</h3>
            <p className="text-gray-600">
              Learn how to save and invest, even with limited resources
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Emergency Preparedness</h3>
            <p className="text-gray-600">
              Build financial resilience without traditional banking requirements
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <Target className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Achievable Goals</h3>
            <p className="text-gray-600">
              Set realistic financial goals and track progress without bank connections
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Accessible to All</h3>
            <p className="text-gray-600">
              No bank account needed. Get financial guidance regardless of your banking status
            </p>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Take a Quick Assessment</h3>
                <p className="text-gray-600">
                  Answer simple questions about your financial situation - no banking details needed
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Get Your Personalized Dashboard</h3>
                <p className="text-gray-600">
                  Access your custom financial plan - works without connecting any bank accounts
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Get Personalized Guidance</h3>
                <p className="text-gray-600">
                  Receive advice on budgeting, saving, and building credit - even without traditional banking
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Build Your Future</h3>
                <p className="text-gray-600">
                  Take steps toward financial stability and independence at your own pace
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Landing;