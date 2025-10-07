import { MessageCircle } from "lucide-react";
import SuggestedQuestion from "./SuggestedQuestion";

interface WelcomeScreenProps {
  onQuestionSelect: (question: string) => void;
}

const suggestedQuestions = [
  "What is the purpose of life?",
  "How do I perform Wudu correctly?",
  "What are the five pillars of Islam?",
  "Can you explain the importance of Ramadan?"
];

export default function WelcomeScreen({ onQuestionSelect }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <MessageCircle className="h-8 w-8 text-primary" />
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
