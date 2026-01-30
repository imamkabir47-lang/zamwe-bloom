import { motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const themes = [
  { id: "pink", name: "Rose Gold", color: "hsl(330, 81%, 71%)", bgColor: "hsl(0, 0%, 100%)" },
  { id: "blue", name: "Ocean Blue", color: "hsl(210, 80%, 55%)", bgColor: "hsl(0, 0%, 100%)" },
  { id: "red", name: "Ruby Red", color: "hsl(0, 75%, 55%)", bgColor: "hsl(0, 0%, 100%)" },
  { id: "black", name: "Midnight", color: "hsl(0, 0%, 15%)", bgColor: "hsl(0, 0%, 100%)" },
] as const;

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <motion.div
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
              style={{ backgroundColor: t.color, borderColor: t.bgColor }}
              whileHover={{ scale: 1.1 }}
            >
              {theme === t.id && <Check className="w-3 h-3 text-white" />}
            </motion.div>
            <span>{t.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
