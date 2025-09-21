import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";

interface QuizData {
  // Basic Info
  age: string;
  income: string;
  employmentStatus: string;
  dependents: string;
  
  // Diversity & Accessibility (for underserved populations)
  gender: string;
  profession: string;
  immigrantStatus: string;
  primaryLanguage: string;
  bankAccess: string;
  
  // Financial Situation
  savings: string;
  debt: string;
  homeOwnership: string;
  monthlyExpenses: string;
  
  // Goals
  primaryGoal: string;
  timeHorizon: string;
  retirementAge: string;
  majorPurchases: string[];
  
  // Risk & Investment
  riskTolerance: string;
  investmentExperience: string;
  currentInvestments: string[];
  emergencyFund: string;
}

const QuizSimplified = () => {
  const navigate = useNavigate();
  const { setQuizData: setGlobalQuizData } = useQuiz();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [quizData, setQuizData] = useState<QuizData>({
    name: "",
    age: "",
    income: "",
    employmentStatus: "",
    dependents: "0",
    
    // Diversity & Accessibility
    gender: "",
    profession: "",
    immigrantStatus: "",
    primaryLanguage: "english",
    bankAccess: "",
    
    savings: "",
    debt: "none",
    homeOwnership: "rent",
    monthlyExpenses: "",
    primaryGoal: "",
    timeHorizon: "",
    retirementAge: "65",
    majorPurchases: [],
    riskTolerance: "",
    investmentExperience: "beginner",
    currentInvestments: [],
    emergencyFund: "none",
  });

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Update global quiz context first (this triggers immediate state updates)
    setGlobalQuizData(quizData);
    
    // Simulate personalization processing time - extended for proper data loading
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const updateQuizData = (field: keyof QuizData, value: any) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Essential Information
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="age">What's your age?</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={quizData.age}
                onChange={(e) => updateQuizData("age", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="income">Annual Income Range</Label>
              <RadioGroup
                value={quizData.income}
                onValueChange={(value) => updateQuizData("income", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="under-50k" id="under-50k" />
                  <Label htmlFor="under-50k">Under $50,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50k-100k" id="50k-100k" />
                  <Label htmlFor="50k-100k">$50,000 - $100,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="100k-150k" id="100k-150k" />
                  <Label htmlFor="100k-150k">$100,000 - $150,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="over-150k" id="over-150k" />
                  <Label htmlFor="over-150k">Over $150,000</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="savings">Current Savings Level</Label>
              <RadioGroup
                value={quizData.savings}
                onValueChange={(value) => updateQuizData("savings", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="under-5k" id="s-under-5k" />
                  <Label htmlFor="s-under-5k">Less than $5,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5k-25k" id="s-5k-25k" />
                  <Label htmlFor="s-5k-25k">$5,000 - $25,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="25k-50k" id="s-25k-50k" />
                  <Label htmlFor="s-25k-50k">$25,000 - $50,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="over-50k" id="s-over-50k" />
                  <Label htmlFor="s-over-50k">Over $50,000</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 1: // Diversity & Accessibility
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                To provide you with the most relevant financial guidance, please share some optional information about yourself. 
                This helps us understand your unique situation and provide better support.
              </p>
            </div>
            
            <div>
              <Label>Gender (optional)</Label>
              <RadioGroup
                value={quizData.gender}
                onValueChange={(value) => updateQuizData("gender", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-binary" id="non-binary" />
                  <Label htmlFor="non-binary">Non-binary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                  <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Current Work/Study Situation</Label>
              <RadioGroup
                value={quizData.profession}
                onValueChange={(value) => updateQuizData("profession", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gig-worker" id="gig-worker" />
                  <Label htmlFor="gig-worker">Gig Worker (Uber, DoorDash, freelance, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full-time" id="full-time" />
                  <Label htmlFor="full-time">Full-time Employee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="part-time" id="part-time" />
                  <Label htmlFor="part-time">Part-time Employee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unemployed" id="unemployed" />
                  <Label htmlFor="unemployed">Currently Looking for Work</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Immigration Status (optional)</Label>
              <RadioGroup
                value={quizData.immigrantStatus}
                onValueChange={(value) => updateQuizData("immigrantStatus", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="us-citizen" id="us-citizen" />
                  <Label htmlFor="us-citizen">US Citizen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="permanent-resident" id="permanent-resident" />
                  <Label htmlFor="permanent-resident">Permanent Resident (Green Card)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="visa-holder" id="visa-holder" />
                  <Label htmlFor="visa-holder">Visa Holder (H1B, F1, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other-status" id="other-status" />
                  <Label htmlFor="other-status">Other Status</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer-not-to-say-immigration" id="prefer-not-to-say-immigration" />
                  <Label htmlFor="prefer-not-to-say-immigration">Prefer not to say</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Banking Access</Label>
              <RadioGroup
                value={quizData.bankAccess}
                onValueChange={(value) => updateQuizData("bankAccess", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="traditional-bank" id="traditional-bank" />
                  <Label htmlFor="traditional-bank">I have traditional bank accounts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-union" id="credit-union" />
                  <Label htmlFor="credit-union">I use a credit union</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online-only" id="online-only" />
                  <Label htmlFor="online-only">I use online-only banks (Chime, Cash App, etc.)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited-access" id="limited-access" />
                  <Label htmlFor="limited-access">I have limited banking access</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-bank-account" id="no-bank-account" />
                  <Label htmlFor="no-bank-account">I don't have a bank account</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2: // Goals & Preferences
        return (
          <div className="space-y-6">
            <div>
              <Label>What's your primary financial goal?</Label>
              <RadioGroup
                value={quizData.primaryGoal}
                onValueChange={(value) => updateQuizData("primaryGoal", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emergency-fund" id="emergency-fund" />
                  <Label htmlFor="emergency-fund">Build Emergency Fund</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pay-debt" id="pay-debt" />
                  <Label htmlFor="pay-debt">Pay Off Debt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="save-home" id="save-home" />
                  <Label htmlFor="save-home">Save for a Home</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retirement" id="retirement" />
                  <Label htmlFor="retirement">Save for Retirement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="invest" id="invest" />
                  <Label htmlFor="invest">Grow Investments</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Investment Risk Tolerance</Label>
              <RadioGroup
                value={quizData.riskTolerance}
                onValueChange={(value) => updateQuizData("riskTolerance", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conservative" id="conservative" />
                  <Label htmlFor="conservative">
                    Conservative - I prefer safety over growth
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">
                    Moderate - I want balanced growth and safety
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="aggressive" id="aggressive" />
                  <Label htmlFor="aggressive">
                    Aggressive - I'm comfortable with risk for higher returns
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Time horizon for your main goal</Label>
              <RadioGroup
                value={quizData.timeHorizon}
                onValueChange={(value) => updateQuizData("timeHorizon", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short">Short term (less than 3 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium term (3-7 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="long" />
                  <Label htmlFor="long">Long term (more than 7 years)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3: // Summary & Confirmation
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Your Financial Profile Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{quizData.age || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Income Range:</span>
                  <span className="font-medium">
                    {quizData.income === "under-50k" && "Under $50,000"}
                    {quizData.income === "50k-100k" && "$50,000 - $100,000"}
                    {quizData.income === "100k-150k" && "$100,000 - $150,000"}
                    {quizData.income === "over-150k" && "Over $150,000"}
                    {!quizData.income && "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Primary Goal:</span>
                  <span className="font-medium">
                    {quizData.primaryGoal === 'emergency-fund' && 'Build Emergency Fund'}
                    {quizData.primaryGoal === 'pay-debt' && 'Pay Off Debt'}
                    {quizData.primaryGoal === 'save-home' && 'Save for a Home'}
                    {quizData.primaryGoal === 'retirement' && 'Save for Retirement'}
                    {quizData.primaryGoal === 'invest' && 'Grow Investments'}
                    {!quizData.primaryGoal && "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Profile:</span>
                  <span className="font-medium capitalize">{quizData.riskTolerance || "Not specified"}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">What's Next?</h3>
              <p className="text-gray-700 mb-4">
                Based on your profile, your personalized dashboard will include:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>AI agents tailored to your {quizData.primaryGoal ? "goal" : "financial situation"}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>{quizData.riskTolerance || "Personalized"} investment recommendations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Real-time financial health monitoring</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Step-by-step guidance to reach your goals</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Ready to start your personalized financial journey?
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    "Essential Information",
    "Tell Us About You",
    "Goals & Preferences", 
    "Review & Confirm"
  ];

  // Show loading screen when completing
  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-600 flex items-center justify-center relative">
              <span className="text-4xl">🦉</span>
              <div className="absolute inset-0 rounded-full border-4 border-blue-300 border-t-transparent animate-spin"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Creating Your Personalized Experience
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
              <span>Analyzing your financial profile...</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" style={{animationDelay: '0.5s'}} />
              <span>Customizing your AI agents...</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Sparkles className="w-5 h-5 text-green-500 animate-pulse" style={{animationDelay: '1s'}} />
              <span>Preparing personalized insights...</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            This will just take a moment. Your financial journey is about to begin!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{stepTitles[currentStep]}</CardTitle>
            <CardDescription>
              {currentStep === 0 && "Let's start with some basic information"}
              {currentStep === 1 && "Help us understand your unique situation"}
              {currentStep === 2 && "Tell us about your financial goals"}
              {currentStep === 3 && "Review your profile and get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep === totalSteps - 1 ? (
                <Button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Complete & View Dashboard
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizSimplified;