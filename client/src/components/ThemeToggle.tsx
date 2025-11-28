import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Moon className="h-5 w-5" />;
      case "dark":
        return <Sparkles className="h-5 w-5" />;
      case "midnight":
        return <Sun className="h-5 w-5" />;
      default:
        return <Moon className="h-5 w-5" />;
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      className="transition-colors"
    >
      {getIcon()}
    </Button>
  );
}
