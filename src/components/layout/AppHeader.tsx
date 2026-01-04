import { Link } from "@tanstack/react-router";
import { Button } from "../ui";
import { AppBackgroundToggle } from "./AppBackground";
import { ThemeToggle } from "../ThemeToggle";
import { ContactMeButton } from "../bits";

export const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full max-w-screen-2xl justify-center">
      <div className="flex w-full items-center justify-between rounded-xl glass px-5 pt-4 pb-4 dark:dark-glass">
        <Link to="/">
          <Button>gmac.dev</Button>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <ContactMeButton />
          <ThemeToggle />
          <AppBackgroundToggle />
        </div>
      </div>
    </header>
  );
};
