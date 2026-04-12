import { IconEyeOff, IconPlayerPlay, IconVideoOff } from '@tabler/icons-react';
import { create } from 'zustand';
import bg1 from '../../assets/bg1.jpeg';
import bg2 from '../../assets/bg2.jpeg';
import vbg1 from '../../assets/vbg1.mp4';
import vbg2 from '../../assets/vbg2.mp4';
import { cn, IconButton } from '../gmac.ui';
import { useTheme } from '../theme-provider';
import { useVariantState } from '../VariantToggle';

interface VideoBGStore {
  isOn: boolean;
  toggle: () => void;
}

const useVideoBGStore = create<VideoBGStore>((set) => ({
  isOn: true,
  toggle: () => set((state) => ({ isOn: !state.isOn }))
}));

export const AppBackground: React.FC = () => {
  const { theme } = useTheme();
  const { variant } = useVariantState();

  const isOn = useVideoBGStore((state) => state.isOn);

  return (
    <>
      {/* bg image */}
      <div
        className={cn('fixed top-0 left-0 -z-50 h-screen min-h-screen w-screen bg-gray-100 bg-cover bg-fixed bg-center dark:bg-gray-950', variant === 'glass' ? 'blur-lg' : '')}
        style={{
          backgroundImage: variant === 'glass' ? (theme === 'dark' ? `url(${bg2})` : `url(${bg1})`) : ''
        }}
      />

      {/* bg video */}
      {theme === 'dark' && (
        <video
          muted
          loop
          autoPlay
          playsInline
          id="myVideo"
          className={cn('fixed top-0 left-0 -z-40 h-screen min-h-screen w-screen object-cover', variant === 'glass' && isOn ? '' : 'hidden')}>
          <source src={vbg2} type="video/mp4" />
        </video>
      )}
      {theme === 'light' && (
        <video
          muted
          loop
          autoPlay
          playsInline
          id="myVideo"
          className={cn('fixed top-0 left-0 -z-40 h-screen min-h-screen w-screen object-cover', variant === 'glass' && isOn ? '' : 'hidden')}>
          <source src={vbg1} type="video/mp4" />
        </video>
      )}
      {/* bg blur */}

      <div className={cn('fixed top-0 left-0 -z-30 h-screen min-h-screen w-screen object-cover backdrop-blur-2xl', variant === 'glass' ? '' : 'hidden')} />
    </>
  );
};

export const AppBackgroundToggle: React.FC = () => {
  const { variant } = useVariantState();
  const toggle = useVideoBGStore((state) => state.toggle);
  const isOn = useVideoBGStore((state) => state.isOn);

  const disabled = variant !== 'glass';

  return (
    <IconButton variant="ghost" theme="blue" onClick={toggle} disabled={disabled}>
      {disabled ? <IconEyeOff /> : isOn ? <IconVideoOff /> : <IconPlayerPlay />}
    </IconButton>
  );
};
