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
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const hasCompletedQuiz = localStorage.getItem("quizCompleted") === "true";
  
  if (!hasCompletedQuiz) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Just handle initial loading - QuizProvider will manage quiz state
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🦉</span>
          </div>
          <p className="text-gray-600">Loading OwlNudge...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <QuizProvider>
        <NotificationsProvider>
          <UXFlagsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRouter />
                <DevPanel />
              </BrowserRouter>
            </TooltipProvider>
          </UXFlagsProvider>
        </NotificationsProvider>
      </QuizProvider>
    </QueryClientProvider>
  );
};

// Router component that has access to QuizContext
function AppRouter() {
  const { isQuizCompleted } = useQuiz();
  
  return (
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
  );
}

export default App;
