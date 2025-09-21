import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuizData {
  // Basic Info
  age: string;
  income: string;
  employmentStatus: string;
  dependents: string;
  
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

const Quiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({
    age: "",
    income: "",
    employmentStatus: "",
    dependents: "",
    savings: "",
    debt: "",
    homeOwnership: "",
    monthlyExpenses: "",
    primaryGoal: "",
    timeHorizon: "",
    retirementAge: "",
    majorPurchases: [],
    riskTolerance: "",
    investmentExperience: "",
    currentInvestments: [],
    emergencyFund: "",
  });

  const totalSteps = 3;
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

  const handleComplete = () => {
    // Save quiz data to localStorage
    localStorage.setItem("quizCompleted", "true");
    localStorage.setItem("quizData", JSON.stringify(quizData));
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  const updateQuizData = (field: keyof QuizData, value: any) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof QuizData, item: string) => {
    const currentArray = quizData[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateQuizData(field, newArray);
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
                  <RadioGroupItem value="under-30k" id="under-30k" />
                  <Label htmlFor="under-30k">Under $30,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30k-50k" id="30k-50k" />
                  <Label htmlFor="30k-50k">$30,000 - $50,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50k-75k" id="50k-75k" />
                  <Label htmlFor="50k-75k">$50,000 - $75,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="75k-100k" id="75k-100k" />
                  <Label htmlFor="75k-100k">$75,000 - $100,000</Label>
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
              <Label htmlFor="employment">Employment Status</Label>
              <RadioGroup
                value={quizData.employmentStatus}
                onValueChange={(value) => updateQuizData("employmentStatus", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employed" id="employed" />
                  <Label htmlFor="employed">Employed Full-Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="self-employed" id="self-employed" />
                  <Label htmlFor="self-employed">Self-Employed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="part-time" id="part-time" />
                  <Label htmlFor="part-time">Part-Time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retired" id="retired" />
                  <Label htmlFor="retired">Retired</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unemployed" id="unemployed" />
                  <Label htmlFor="unemployed">Not Currently Employed</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="dependents">Number of Dependents</Label>
              <Input
                id="dependents"
                type="number"
                placeholder="0"
                value={quizData.dependents}
                onChange={(e) => updateQuizData("dependents", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 1: // Goals & Risk Profile
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="savings">Total Savings & Investments</Label>
              <RadioGroup
                value={quizData.savings}
                onValueChange={(value) => updateQuizData("savings", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="under-1k" id="s-under-1k" />
                  <Label htmlFor="s-under-1k">Less than $1,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1k-5k" id="s-1k-5k" />
                  <Label htmlFor="s-1k-5k">$1,000 - $5,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5k-10k" id="s-5k-10k" />
                  <Label htmlFor="s-5k-10k">$5,000 - $10,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10k-25k" id="s-10k-25k" />
                  <Label htmlFor="s-10k-25k">$10,000 - $25,000</Label>
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

            <div>
              <Label htmlFor="debt">Total Debt (excluding mortgage)</Label>
              <RadioGroup
                value={quizData.debt}
                onValueChange={(value) => updateQuizData("debt", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="d-none" />
                  <Label htmlFor="d-none">No debt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="under-5k" id="d-under-5k" />
                  <Label htmlFor="d-under-5k">Less than $5,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5k-10k" id="d-5k-10k" />
                  <Label htmlFor="d-5k-10k">$5,000 - $10,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10k-25k" id="d-10k-25k" />
                  <Label htmlFor="d-10k-25k">$10,000 - $25,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="25k-50k" id="d-25k-50k" />
                  <Label htmlFor="d-25k-50k">$25,000 - $50,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="over-50k" id="d-over-50k" />
                  <Label htmlFor="d-over-50k">Over $50,000</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="home">Home Ownership Status</Label>
              <RadioGroup
                value={quizData.homeOwnership}
                onValueChange={(value) => updateQuizData("homeOwnership", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="own" id="own" />
                  <Label htmlFor="own">Own (with mortgage)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="own-outright" id="own-outright" />
                  <Label htmlFor="own-outright">Own (no mortgage)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rent" id="rent" />
                  <Label htmlFor="rent">Rent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="expenses">Monthly Living Expenses</Label>
              <Input
                id="expenses"
                type="number"
                placeholder="Enter amount in dollars"
                value={quizData.monthlyExpenses}
                onChange={(e) => updateQuizData("monthlyExpenses", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 2: // Financial Goals
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
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="education" id="education" />
                  <Label htmlFor="education">Save for Education</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Time horizon for main goal</Label>
              <RadioGroup
                value={quizData.timeHorizon}
                onValueChange={(value) => updateQuizData("timeHorizon", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="less-1" id="less-1" />
                  <Label htmlFor="less-1">Less than 1 year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-3" id="1-3" />
                  <Label htmlFor="1-3">1-3 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-5" id="3-5" />
                  <Label htmlFor="3-5">3-5 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5-10" id="5-10" />
                  <Label htmlFor="5-10">5-10 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="over-10" id="over-10" />
                  <Label htmlFor="over-10">More than 10 years</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="retirement">Target retirement age</Label>
              <Input
                id="retirement"
                type="number"
                placeholder="Enter age"
                value={quizData.retirementAge}
                onChange={(e) => updateQuizData("retirementAge", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Major purchases planned (check all that apply)</Label>
              <div className="space-y-2 mt-2">
                {["Home", "Car", "Wedding", "Vacation", "Education", "Business"].map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={quizData.majorPurchases.includes(item)}
                      onCheckedChange={() => toggleArrayItem("majorPurchases", item)}
                    />
                    <Label htmlFor={item}>{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Risk Tolerance & Investment Experience
        return (
          <div className="space-y-6">
            <div>
              <Label>Risk Tolerance</Label>
              <RadioGroup
                value={quizData.riskTolerance}
                onValueChange={(value) => updateQuizData("riskTolerance", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conservative" id="conservative" />
                  <Label htmlFor="conservative">
                    Conservative - Preserve capital, minimal risk
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate-conservative" id="moderate-conservative" />
                  <Label htmlFor="moderate-conservative">
                    Moderately Conservative - Some growth, limited risk
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">
                    Moderate - Balance growth and risk
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate-aggressive" id="moderate-aggressive" />
                  <Label htmlFor="moderate-aggressive">
                    Moderately Aggressive - Higher growth, accept more risk
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="aggressive" id="aggressive" />
                  <Label htmlFor="aggressive">
                    Aggressive - Maximum growth, high risk tolerance
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Investment Experience</Label>
              <RadioGroup
                value={quizData.investmentExperience}
                onValueChange={(value) => updateQuizData("investmentExperience", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="exp-none" />
                  <Label htmlFor="exp-none">No experience</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">Beginner (less than 2 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate (2-5 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="experienced" id="experienced" />
                  <Label htmlFor="experienced">Experienced (5-10 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expert" id="expert" />
                  <Label htmlFor="expert">Expert (10+ years)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Current Investment Types (check all that apply)</Label>
              <div className="space-y-2 mt-2">
                {[
                  "Savings Account",
                  "401(k)/IRA",
                  "Stocks",
                  "Bonds",
                  "Mutual Funds",
                  "ETFs",
                  "Real Estate",
                  "Cryptocurrency",
                  "None"
                ].map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={quizData.currentInvestments.includes(item)}
                      onCheckedChange={() => toggleArrayItem("currentInvestments", item)}
                    />
                    <Label htmlFor={item}>{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Emergency Fund & Final Questions
        return (
          <div className="space-y-6">
            <div>
              <Label>Current Emergency Fund Status</Label>
              <RadioGroup
                value={quizData.emergencyFund}
                onValueChange={(value) => updateQuizData("emergencyFund", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="ef-none" />
                  <Label htmlFor="ef-none">No emergency fund</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="less-1month" id="less-1month" />
                  <Label htmlFor="less-1month">Less than 1 month of expenses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-3months" id="1-3months" />
                  <Label htmlFor="1-3months">1-3 months of expenses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-6months" id="3-6months" />
                  <Label htmlFor="3-6months">3-6 months of expenses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="over-6months" id="over-6months" />
                  <Label htmlFor="over-6months">More than 6 months of expenses</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Almost Done!</h3>
              <p className="text-gray-700 mb-4">
                Based on your responses, we'll create a personalized financial dashboard with:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Custom recommendations from specialized AI agents</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Real-time financial metrics tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>Personalized action plans and milestones</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <span>24/7 access to financial planning tools</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Your information is secure and will only be used to personalize your experience.
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
    "Goals & Risk Profile",
    "Final Review"
  ];

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
              {currentStep === 0 && "Let's start with some basic information about you"}
              {currentStep === 1 && "Tell us about your financial goals and preferences"}
              {currentStep === 2 && "Review and complete your financial profile"}
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

export default Quiz;