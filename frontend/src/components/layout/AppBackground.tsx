import { IconPlayerPlay, IconVideoOff } from '@tabler/icons-react';
import { create } from 'zustand';
import bg1 from '../../assets/bg1.jpeg';
import bg2 from '../../assets/bg2.jpeg';
import vbg1 from '../../assets/vbg1.mp4';
import vbg2 from '../../assets/vbg2.mp4';
import { IconButton } from '../gmac.ui';
import { useTheme } from '../theme-provider';

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

  const isOn = useVideoBGStore((state) => state.isOn);

  return (
    <>
      {/* bg image */}
      <div
        className="fixed top-0 left-0 -z-50 h-screen min-h-screen w-screen bg-cover bg-fixed bg-center blur-lg dark:bg-zinc-950"
        style={{
          backgroundImage: theme === 'dark' ? `url(${bg2})` : `url(${bg1})`
        }}
      />
      {/* bg video */}
      {theme === 'dark' && isOn && (
        <video muted loop autoPlay playsInline id="myVideo" className="fixed top-0 left-0 -z-40 h-screen min-h-screen w-screen object-cover">
          <source src={vbg2} type="video/mp4" />
        </video>
      )}
      {theme === 'light' && isOn && (
        <video muted loop autoPlay playsInline id="myVideo" className="fixed top-0 left-0 -z-40 h-screen min-h-screen w-screen object-cover">
          <source src={vbg1} type="video/mp4" />
        </video>
      )}
      {/* bg blur */}

      <div className="fixed top-0 left-0 -z-30 h-screen min-h-screen w-screen object-cover backdrop-blur-2xl" />
    </>
  );
};

export const AppBackgroundToggle: React.FC = () => {
  const toggle = useVideoBGStore((state) => state.toggle);
  const isOn = useVideoBGStore((state) => state.isOn);

  return (
    <IconButton variant="ghost" theme="blue" onClick={toggle}>
      {isOn ? <IconVideoOff /> : <IconPlayerPlay />}
    </IconButton>
  );
};
