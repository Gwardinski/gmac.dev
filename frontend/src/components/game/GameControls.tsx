import { Kbd } from "../ui/kbd";

export const GameControls = () => {
  return (
    <section className="flex gap-8 glass dark:dark-glass p-4 rounded-md text-sm">
      <div className="flex flex-col gap-2 justify-center items-center">
        <span className="flex gap-1 flex-wrap">
          <Kbd>W</Kbd>
          <Kbd>A</Kbd>
          <Kbd>S</Kbd>
          <Kbd>D</Kbd>
        </span>
        MOVE
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <span className="flex gap-1 flex-wrap">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
        </span>
        SHOOT
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <span className="flex gap-1 flex-wrap">
          <Kbd>Space</Kbd>
        </span>
        SHIELD
      </div>
    </section>
  );
};