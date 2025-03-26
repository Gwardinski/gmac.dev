import { IconPlayerPlay, IconVideoOff } from "@tabler/icons-react";
import { create } from "zustand";
import { Button } from "../ui";
import { useTheme } from "../theme-provider";

interface VideoBGStore {
  isOn: boolean;
  toggle: () => void;
}

const useVideoBGStore = create<VideoBGStore>((set) => ({
  isOn: true,
  toggle: () => set((state) => ({ isOn: !state.isOn })),
}));

export const AppBackground: React.FC = () => {
  const { theme } = useTheme();

  const isOn = useVideoBGStore((state) => state.isOn);

  return (
    <>
      {/* bg image */}
      <div className="fixed left-0 top-0 -z-50 h-screen min-h-screen w-screen bg-[url('/src/assets/bg1.jpeg')] bg-cover bg-fixed bg-center blur-lg dark:bg-zinc-950 dark:bg-[url('/src/assets/bg2.jpeg')]" />
      {/* bg video */}
      {theme === "dark" && isOn && (
        <video
          muted
          loop
          autoPlay
          id="myVideo"
          className="fixed left-0 top-0 -z-40 h-screen min-h-screen w-screen object-cover"
        >
          <source src={"/src/assets/vbg2.mp4"} type="video/mp4" />
        </video>
      )}
      {theme === "light" && isOn && (
        <video
          muted
          loop
          autoPlay
          id="myVideo"
          className="fixed left-0 top-0 -z-40 h-screen min-h-screen w-screen object-cover"
        >
          <source src={"/src/assets/vbg1.mp4"} type="video/mp4" />
        </video>
      )}
      {/* bg blur */}
      {isOn && (
        <div className="dark:filter-dark fixed left-0 top-0 -z-30 h-screen min-h-screen w-screen object-cover filter" />
      )}
    </>
  );
};

export const AppBackgroundToggle: React.FC = () => {
  const toggle = useVideoBGStore((state) => state.toggle);
  const isOn = useVideoBGStore((state) => state.isOn);

  return (
    <Button size="icon" variant="outline" onClick={toggle}>
      {isOn ? <IconVideoOff /> : <IconPlayerPlay />}
    </Button>
  );
};
