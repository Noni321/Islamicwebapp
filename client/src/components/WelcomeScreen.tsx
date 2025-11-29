import { Sparkles, Globe } from "lucide-react";
import SuggestedQuestion from "./SuggestedQuestion";
import { useState, useEffect } from "react";

interface WelcomeScreenProps {
  onQuestionSelect: (question: string) => void;
}

interface MultiLangQuestion {
  question: string;
  language: string;
  flag: string;
}

const allQuestions: MultiLangQuestion[] = [
  { question: "What is the purpose of life in Islam?", language: "English", flag: "EN" },
  { question: "How do I perform Wudu correctly?", language: "English", flag: "EN" },
  { question: "What are the five pillars of Islam?", language: "English", flag: "EN" },
  { question: "Can you explain the importance of Ramadan?", language: "English", flag: "EN" },
  { question: "What is the significance of Friday prayer?", language: "English", flag: "EN" },
  { question: "How should I recite Surah Al-Fatiha?", language: "English", flag: "EN" },
  { question: "Namaz kaise padhen step by step?", language: "Urdu", flag: "UR" },
  { question: "Zakat ka hisaab kaise lagayein?", language: "Urdu", flag: "UR" },
  { question: "Ramzan ki fazilat kya hai?", language: "Urdu", flag: "UR" },
  { question: "Tawheed ka matlab kya hai?", language: "Urdu", flag: "UR" },
  { question: "Dua maangne ka tareeqa kya hai?", language: "Urdu", flag: "UR" },
  { question: "ما هي أركان الإسلام الخمسة؟", language: "Arabic", flag: "AR" },
  { question: "كيف أتوضأ بشكل صحيح؟", language: "Arabic", flag: "AR" },
  { question: "ما فضل قراءة القرآن؟", language: "Arabic", flag: "AR" },
  { question: "كيف أحسب الزكاة؟", language: "Arabic", flag: "AR" },
  { question: "ما معنى التوحيد؟", language: "Arabic", flag: "AR" },
  { question: "Hayattaki amacim nedir?", language: "Turkish", flag: "TR" },
  { question: "Namaz nasil kilinir?", language: "Turkish", flag: "TR" },
  { question: "Comment faire la priere correctement?", language: "French", flag: "FR" },
  { question: "Quels sont les cinq piliers de l'Islam?", language: "French", flag: "FR" },
  { question: "Wie berechnet man Zakat?", language: "German", flag: "DE" },
  { question: "Islam mein zindagi ka maqsad kya hai?", language: "Hindi", flag: "HI" },
  { question: "Namaz padhne ka sahi tarika kya hai?", language: "Hindi", flag: "HI" },
  { question: "Ramadan ka mahatva kya hai?", language: "Hindi", flag: "HI" },
  { question: "Quran padhne ke fayde kya hain?", language: "Hindi", flag: "HI" },
  { question: "Islam e jibonar uddeshyo ki?", language: "Bengali", flag: "BN" },
  { question: "Namaz kivabe pora korbo?", language: "Bengali", flag: "BN" },
  { question: "Ramadan er gurutto ki?", language: "Bengali", flag: "BN" },
  { question: "Zakat ki ebong keno dite hobe?", language: "Bengali", flag: "BN" },
];

const getRandomQuestions = (count: number): MultiLangQuestion[] => {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default function WelcomeScreen({ onQuestionSelect }: WelcomeScreenProps) {
  const [suggestedQuestions, setSuggestedQuestions] = useState<MultiLangQuestion[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setSuggestedQuestions(getRandomQuestions(4));
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className={`text-center space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse">
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

        <div className={`flex items-center justify-center gap-2 transition-all duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Globe className="h-4 w-4 text-primary" />
          <p className="text-sm text-primary font-medium" data-testid="text-any-language">
            Ask in any language
          </p>
        </div>
        
        <div className="space-y-3">
          <p className={`text-sm font-medium text-muted-foreground text-center transition-all duration-500 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Suggested Questions
          </p>
          <div className="grid gap-3">
            {suggestedQuestions.map((item, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <SuggestedQuestion
                  question={item.question}
                  onClick={() => onQuestionSelect(item.question)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
