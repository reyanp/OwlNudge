import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import QuizSimplified from "./pages/QuizSimplified";
import NotFound from "./pages/NotFound";
import { DevPanel } from "./components/DevPanel";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { UXFlagsProvider } from "@/contexts/UXFlagsContext";
import { QuizProvider } from "@/contexts/QuizContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const hasCompletedQuiz = localStorage.getItem("quizCompleted") === "true";
  
  if (!hasCompletedQuiz) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  useEffect(() => {
    // Check if user has completed the quiz
    const completed = localStorage.getItem("quizCompleted") === "true";
    setIsQuizCompleted(completed);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <QuizProvider>
        <NotificationsProvider>
          <UXFlagsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Routes>
                {/* Landing page - shown when quiz not completed */}
                <Route 
                  path="/" 
                  element={
                    isQuizCompleted ? <Navigate to="/dashboard" replace /> : <Landing />
                  } 
                />
                
                {/* Quiz route */}
                <Route path="/quiz" element={<QuizSimplified />} />
                
                {/* Protected Dashboard route */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </BrowserRouter>
              <DevPanel />
            </TooltipProvider>
          </UXFlagsProvider>
        </NotificationsProvider>
      </QuizProvider>
    </QueryClientProvider>
  );
};

export default App;
