import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ResetQuizButton = () => {
  const navigate = useNavigate();

  const handleReset = () => {
    // Clear all quiz-related data from localStorage
    localStorage.removeItem("quizCompleted");
    localStorage.removeItem("quizData");
    
    // Navigate back to landing page
    navigate("/");
    
    // Reload to ensure state is fully reset
    window.location.reload();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retake Assessment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retake Financial Assessment?</AlertDialogTitle>
          <AlertDialogDescription>
            This will clear your current profile and quiz responses. You'll need to complete the assessment again to access the dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>
            Yes, Retake Assessment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};