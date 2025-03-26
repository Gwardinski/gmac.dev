import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark && <IconSun />}
      {!isDark && <IconMoon />}
    </Button>
  );
};
