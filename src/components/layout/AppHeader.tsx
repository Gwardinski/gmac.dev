import { Link } from "@tanstack/react-router";
import { Button } from "../ui";
import { AppBackgroundToggle } from "./AppBackground";
import { ThemeToggle } from "../ThemeToggle";

export const AppHeader: React.FC = () => {
  return (
    <header className="glass dark:dark-glass px-4 rounded-xl w-full flex min-h-16 h-16 items-center justify-start gap-2 overflow-hidden bg-transparent">
      <Link to="/">
        <Button variant="outline">gmac.dev</Button>
      </Link>

      <div className="tracking-widest text-2xl align-center animate-pulse ml-8">
        WORK IN PROGRESS
      </div>

      <div className="flex gap-2 ml-auto">
        <ThemeToggle />
        <AppBackgroundToggle />
      </div>
    </header>
  );
};
