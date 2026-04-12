import { IconGlass, IconPaint } from '@tabler/icons-react';
import { create } from 'zustand';
import { IconButton } from './gmac.ui';

export const VariantToggle: React.FC = () => {
  const { variant, setVariant } = useVariantState();

  return (
    <IconButton variant="ghost" theme="blue" onClick={() => setVariant(variant === 'glass' ? 'solid' : 'glass')}>
      {variant === 'glass' ? <IconPaint /> : <IconGlass />}
    </IconButton>
  );
};

interface VariantState {
  variant: 'solid' | 'glass';
  setVariant: (variant: 'solid' | 'glass') => void;
}

export const useVariantState = create<VariantState>((set) => ({
  variant: 'glass',
  setVariant: (variant: 'solid' | 'glass') => set(() => ({ variant }))
}));
