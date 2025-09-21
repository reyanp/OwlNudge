import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface QuizData {
  age: string;
  income: string;
  employmentStatus: string;
  dependents: string;
  savings: string;
  debt: string;
  homeOwnership: string;
  monthlyExpenses: string;
  primaryGoal: string;
  timeHorizon: string;
  retirementAge: string;
  majorPurchases: string[];
  riskTolerance: string;
  investmentExperience: string;
  currentInvestments: string[];
  emergencyFund: string;
}

interface QuizContextType {
  quizData: QuizData | null;
  isQuizCompleted: boolean;
  setQuizData: (data: QuizData) => void;
  clearQuizData: () => void;
  getUserProfile: () => {
    riskProfile: string;
    experienceLevel: string;
    primaryFocus: string;
    timeframe: string;
  } | null;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quizData, setQuizDataState] = useState<QuizData | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  useEffect(() => {
    // Load quiz data from localStorage on mount
    const savedQuizData = localStorage.getItem("quizData");
    const quizCompleted = localStorage.getItem("quizCompleted") === "true";
    
    if (savedQuizData && quizCompleted) {
      try {
        setQuizDataState(JSON.parse(savedQuizData));
        setIsQuizCompleted(true);
      } catch (e) {
        console.error("Failed to parse quiz data:", e);
      }
    }
  }, []);

  const setQuizData = (data: QuizData) => {
    setQuizDataState(data);
    localStorage.setItem("quizData", JSON.stringify(data));
    localStorage.setItem("quizCompleted", "true");
    setIsQuizCompleted(true);
  };

  const clearQuizData = () => {
    setQuizDataState(null);
    localStorage.removeItem("quizData");
    localStorage.removeItem("quizCompleted");
    setIsQuizCompleted(false);
  };

  const getUserProfile = () => {
    if (!quizData) return null;

    // Determine risk profile
    let riskProfile = quizData.riskTolerance || "moderate";
    
    // Determine experience level
    let experienceLevel = quizData.investmentExperience || "beginner";
    
    // Determine primary focus based on goals
    let primaryFocus = "balanced";
    if (quizData.primaryGoal === "emergency-fund" || quizData.primaryGoal === "pay-debt") {
      primaryFocus = "stability";
    } else if (quizData.primaryGoal === "invest" || quizData.primaryGoal === "retirement") {
      primaryFocus = "growth";
    } else if (quizData.primaryGoal === "save-home" || quizData.primaryGoal === "education") {
      primaryFocus = "saving";
    }
    
    // Determine timeframe
    let timeframe = "medium-term";
    if (quizData.timeHorizon === "less-1" || quizData.timeHorizon === "1-3") {
      timeframe = "short-term";
    } else if (quizData.timeHorizon === "over-10") {
      timeframe = "long-term";
    }

    return {
      riskProfile,
      experienceLevel,
      primaryFocus,
      timeframe
    };
  };

  return (
    <QuizContext.Provider 
      value={{ 
        quizData, 
        isQuizCompleted, 
        setQuizData, 
        clearQuizData,
        getUserProfile 
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};