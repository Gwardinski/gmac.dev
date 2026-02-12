import { Kbd } from '../ui/kbd';

export const GameControls = () => {
  return (
    <section className="flex gap-8 rounded-md glass p-4 text-sm dark:dark-glass">
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="flex flex-wrap gap-1">
          <Kbd>W</Kbd>
          <Kbd>A</Kbd>
          <Kbd>S</Kbd>
          <Kbd>D</Kbd>
        </span>
        MOVE
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <span className="flex flex-wrap gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
        </span>
        SHOOT
      </div>
    </section>
  );
};
