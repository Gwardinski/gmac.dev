import { Link } from "@tanstack/react-router";
import { Button } from "../ui";
import { AppBackgroundToggle } from "./AppBackground";
import { ThemeToggle } from "../ThemeToggle";
import { ContactMeButton } from "../bits";

export const AppHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center backdrop-blur-2xl z-10 py-4">
      <div className="px-2 md:px-4 w-full flex justify-center max-w-screen-2xl mx-auto h-16">
        <div className="flex items-center justify-between w-full glass dark:dark-glass pt-4 px-5 pb-4 rounded-xl">
          <Link to="/">
            <Button variant="outline">gmac.dev</Button>
          </Link>

          <div className="tracking-widest text-2xl align-center animate-pulse ml-8">
            <span className="hidden md:inline">WORK IN PROGRESS</span>
            <span className="inline md:hidden">🏗️ WIP 🏗️</span>
          </div>

          <div className="flex gap-2 ml-auto">
            <ContactMeButton />
            <ThemeToggle />
            <AppBackgroundToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
