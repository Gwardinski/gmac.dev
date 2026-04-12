import { Card, CardHeader, TextAnchor } from '../gmac.ui';
import { useVariantState } from '../VariantToggle';

export const AppFooter: React.FC = () => {
  const { variant } = useVariantState();
  return (
    <Card variant={variant} className="mt-auto text-sm">
      <CardHeader column>
        <span className="relative flex items-center gap-2">
          <TextAnchor href="https://github.com/Gwardinski">@Gwardinski</TextAnchor>
          <img src="/src/assets/cyndaquil.gif" className="absolute -top-2 left-28 h-8 w-8" />
        </span>
        <p className="text-gray-700 dark:text-gray-300">gordon.macintyre@proton.me</p>
      </CardHeader>
    </Card>
  );
};
