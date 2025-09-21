import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuiz } from "@/contexts/QuizContext";

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSettingsDialog({ open, onOpenChange }: ProfileSettingsDialogProps) {
  const { quizData, setQuizData } = useQuiz();
  const [name, setName] = useState<string>(quizData?.name || "");
  const [language, setLanguage] = useState<string>(quizData?.primaryLanguage || "english");

  const onSave = () => {
    setQuizData({
      ...(quizData || ({} as any)),
      name: name.trim(),
      primaryLanguage: language,
    } as any);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Profile & Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-slate-500">Shown in your dashboard greeting.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <RadioGroup value={language} onValueChange={setLanguage}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="english" id="lang-en" />
                <Label htmlFor="lang-en">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spanish" id="lang-es" />
                <Label htmlFor="lang-es">Español (basic)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
