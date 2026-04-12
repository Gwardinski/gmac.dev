import { ThemeToggle } from '../ThemeToggle';
import { useVariantState, VariantToggle } from '../VariantToggle';
import { ContactMeButton } from '../bits';
import { ButtonLink, Card } from '../gmac.ui';
import { AppBackgroundToggle } from './AppBackground';

export const AppHeader: React.FC = () => {
  const { variant } = useVariantState();

  return (
    <header className="sticky top-0 z-10 flex w-full max-w-screen-2xl justify-center">
      <Card variant={variant} theme="gray" as="div" className="flex-row">
        <ButtonLink to="/" variant="glass">
          gmac.dev
        </ButtonLink>

        <div className="ml-auto flex items-center gap-2">
          <ContactMeButton />
          <ThemeToggle />
          <VariantToggle />
          <AppBackgroundToggle />
        </div>
      </Card>
    </header>
  );
};
