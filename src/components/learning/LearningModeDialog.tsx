import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Puzzle, Brain, Gamepad2 } from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";

interface LearningModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Question {
  id: string;
  prompt: string;
  options: { id: string; label: string; correct?: boolean }[];
}

// Hard-coded questions pool
const QUESTIONS_POOL: Question[] = [
  {
    id: 'emergency-fund',
    prompt: 'A good first emergency fund target is:',
    options: [
      { id: 'a', label: '$100,000' },
      { id: 'b', label: '$1,000 or 1 month of expenses', correct: true },
      { id: 'c', label: 'No need for an emergency fund' },
    ],
  },
  {
    id: 'credit-util',
    prompt: 'What is a healthy credit utilization ratio?',
    options: [
      { id: 'a', label: 'Under 30%', correct: true },
      { id: 'b', label: 'Around 60%' },
      { id: 'c', label: 'Over 90% is fine' },
    ],
  },
  {
    id: 'budgeting',
    prompt: 'The 50/30/20 rule suggests spending:',
    options: [
      { id: 'a', label: '50% needs, 30% wants, 20% savings', correct: true },
      { id: 'b', label: '50% wants, 30% needs, 20% savings' },
      { id: 'c', label: '50% savings, 30% needs, 20% wants' },
    ],
  },
  {
    id: 'compound-interest',
    prompt: 'Compound interest works best when you:',
    options: [
      { id: 'a', label: 'Start investing later in life' },
      { id: 'b', label: 'Start early and invest regularly', correct: true },
      { id: 'c', label: 'Only invest large amounts occasionally' },
    ],
  },
  {
    id: 'debt-payoff',
    prompt: 'Which debt should you typically pay off first?',
    options: [
      { id: 'a', label: 'The largest balance' },
      { id: 'b', label: 'The highest interest rate', correct: true },
      { id: 'c', label: 'The oldest debt' },
    ],
  },
];

export function LearningModeDialog({ open, onOpenChange }: LearningModeDialogProps) {
  const { quizData } = useQuiz();
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Shuffle array utility
  const shuffle = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize questions when dialog opens
  useEffect(() => {
    if (open && !gameStarted) {
      const shuffledQuestions = shuffle(QUESTIONS_POOL).slice(0, 3); // Pick 3 random questions
      // Shuffle options for each question
      const questionsWithShuffledOptions = shuffledQuestions.map(q => ({
        ...q,
        options: shuffle(q.options)
      }));
      setCurrentQuestions(questionsWithShuffledOptions);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowResults(false);
      setGameStarted(false);
    }
  }, [open, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;
  const progress = gameStarted && totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return currentQuestions.reduce((score, question) => {
      const userAnswer = answers[question.id];
      const correctOption = question.options.find(opt => opt.correct);
      return score + (userAnswer === correctOption?.id ? 1 : 0);
    }, 0);
  };

  const handleClose = () => {
    resetGame();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* Dark header area */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900 text-slate-100">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#4f46e5,transparent_25%),radial-gradient(circle_at_80%_0%,#0ea5e9,transparent_25%)]"></div>
          <DialogHeader className="relative px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Puzzle className="w-5 h-5 text-indigo-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 border border-indigo-300 flex items-center justify-center shadow">
                  <Gamepad2 className="w-3 h-3 text-white" />
                </div>
              </div>
              <DialogTitle className="text-slate-100 text-xl">Learning Mode</DialogTitle>
              <Badge className="ml-1 bg-indigo-600 border-indigo-500">Play & Learn</Badge>
            </div>
            <p className="text-sm text-slate-300 mt-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-300" />
              A quick quiz to test your financial knowledge!
            </p>
          </DialogHeader>
          {gameStarted && !showResults && (
            <div className="relative px-6 pb-5">
              <Progress value={progress} className="h-2 bg-slate-800" />
              <p className="text-xs text-slate-400 mt-2">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            </div>
          )}
        </div>

        {/* Body - dark themed */}
        <div className="bg-slate-950 text-slate-100 px-6 py-6 space-y-6">
          {!gameStarted ? (
            // Welcome screen
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                  <Brain className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Welcome{quizData?.name ? `, ${quizData.name}` : ''}!</h3>
                  <p className="text-slate-400 text-sm">Test your financial knowledge with 3 quick questions.</p>
                </div>
              </div>
              <p className="text-slate-300">
                This quick quiz will test your understanding of basic financial concepts. Are you ready to challenge yourself?
              </p>
              <div className="flex justify-end">
                <Button onClick={startGame} className="bg-indigo-600 hover:bg-indigo-700">Start Quiz</Button>
              </div>
            </div>
          ) : showResults ? (
            // Results screen
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center border border-indigo-400">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Quiz Complete!</h4>
                  <p className="text-slate-300 text-sm">
                    You got <span className="font-bold text-indigo-300">{calculateScore()}</span> out of {totalQuestions} correct.
                  </p>
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={resetGame} className="border-slate-700 text-slate-200">Play Again</Button>
                <Button onClick={handleClose} className="bg-indigo-600 hover:bg-indigo-700">Done</Button>
              </div>
            </div>
          ) : currentQuestion ? (
            // Question screen
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">{currentQuestion.prompt}</h4>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      answers[currentQuestion.id] === option.id 
                        ? 'border-indigo-400 bg-slate-900 ring-2 ring-indigo-500/40' 
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm leading-relaxed">{option.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-slate-400">Choose an answer to continue</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose} className="border-slate-700 text-slate-200">Exit</Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={!answers[currentQuestion.id]} 
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Loading state
            <div className="text-center py-8">
              <p className="text-slate-400">Loading questions...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
