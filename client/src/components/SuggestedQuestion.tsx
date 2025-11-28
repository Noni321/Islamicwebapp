import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SuggestedQuestionProps {
  question: string;
  language?: string;
  onClick: () => void;
}

export default function SuggestedQuestion({ question, language, onClick }: SuggestedQuestionProps) {
  return (
    <Card
      className="p-4 cursor-pointer transition-all hover-elevate active-elevate-2 hover:shadow-md"
      onClick={onClick}
      data-testid="card-suggested-question"
    >
      <div className="flex items-start gap-3">
        <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm leading-relaxed flex-1">{question}</p>
        {language && (
          <Badge variant="secondary" className="text-xs shrink-0">
            {language}
          </Badge>
        )}
      </div>
    </Card>
  );
}
