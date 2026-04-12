import { Card, CardHeader } from '../gmac.ui';
import { useVariantState } from '../VariantToggle';

export const AppFooter: React.FC = () => {
  const { variant } = useVariantState();
  return (
    <Card variant={variant} className="mt-auto text-sm">
      <CardHeader column>
        <a href="https://github.com/Gwardinski" className="text-gray-700 hover:underline dark:text-gray-300">
          @Gwardinski
        </a>
        <p className="text-gray-700 dark:text-gray-300">gordon.macintyre@proton.me</p>
      </CardHeader>
    </Card>
  );
};
