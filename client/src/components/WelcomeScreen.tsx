import { Sparkles } from "lucide-react";
import SuggestedQuestion from "./SuggestedQuestion";
import { useState, useEffect } from "react";

interface WelcomeScreenProps {
  onQuestionSelect: (question: string) => void;
}

const allQuestions = [
  "What is the purpose of life?",
  "How do I perform Wudu correctly?",
  "What are the five pillars of Islam?",
  "Can you explain the importance of Ramadan?",
  "How do I perform Salah step by step?",
  "What is the meaning of Tawheed?",
  "Can you explain the concept of Halal and Haram?",
  "What are the benefits of reciting the Quran?",
  "How should I seek forgiveness in Islam?",
  "What is the significance of Friday prayer?",
  "Can you explain the concept of Qadar (destiny)?",
  "What are the manners of making Dua?",
  "How do I calculate Zakat?",
  "What is the importance of family in Islam?",
  "Can you explain the life of Prophet Muhammad (PBUH)?",
  "What are the signs of the Day of Judgment?",
  "How should I dress according to Islamic guidelines?",
  "What is the significance of the Night of Power (Laylatul Qadr)?",
  "How do I maintain patience during difficult times?",
  "What is the importance of seeking knowledge in Islam?"
];

const getRandomQuestions = (count: number) => {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default function WelcomeScreen({ onQuestionSelect }: WelcomeScreenProps) {
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  useEffect(() => {
    setSuggestedQuestions(getRandomQuestions(4));
  }, []);
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold font-serif">
              السلام عليكم
            </h1>
            <p className="text-muted-foreground">
              Ask your Islamic questions and receive guidance
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground text-center">
            Suggested Questions
          </p>
          <div className="grid gap-3">
            {suggestedQuestions.map((question, index) => (
              <SuggestedQuestion
                key={index}
                question={question}
                onClick={() => onQuestionSelect(question)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
