import { IconMoon, IconSun } from '@tabler/icons-react';
import { IconButton } from './gmac.ui';
import { useTheme } from './theme-provider';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <IconButton variant="ghost" theme="blue" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? <IconSun /> : <IconMoon />}
    </IconButton>
  );
};
