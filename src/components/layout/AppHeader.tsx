import { Link } from "@tanstack/react-router";
import { Button } from "../ui";
import { AppBackgroundToggle } from "./AppBackground";
import { ThemeToggle } from "../ThemeToggle";
import { ContactMeButton } from "../bits";

export const AppHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 z-10 flex w-full items-center py-4 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl justify-center px-2 md:px-4">
        <div className="flex w-full items-center justify-between rounded-xl glass px-5 pt-4 pb-4 dark:dark-glass">
          <Link to="/">
            <Button variant="outline">gmac.dev</Button>
          </Link>

          <div className="align-center ml-8 animate-pulse text-2xl tracking-widest">
            <span className="hidden md:inline">WORK IN PROGRESS</span>
            <span className="inline md:hidden">🏗️ WIP 🏗️</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ContactMeButton />
            <ThemeToggle />
            <AppBackgroundToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
