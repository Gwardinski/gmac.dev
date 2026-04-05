import { create } from 'zustand';
import { Button } from '../button';
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader } from '../sheet';
import { P1 } from '../typography';

export const SheetMock = () => {
  const { topOpen, rightOpen, bottomOpen, leftOpen, closeTop, closeRight, closeBottom, closeLeft, openTop, openRight, openBottom, openLeft } = useSheetState();

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={openTop}>
          Open top
        </Button>
        <Button type="button" onClick={openRight}>
          Open right
        </Button>
        <Button type="button" onClick={openBottom}>
          Open bottom
        </Button>
        <Button type="button" onClick={openLeft}>
          Open left
        </Button>
      </div>

      <Sheet open={topOpen} onOpenChange={closeTop}>
        <SheetContent side="top">
          <SheetHeader title="SheetTitle" description="SheetDescription — side top" />
          <SheetBody>
            <P1>SheetBody content</P1>
          </SheetBody>
          <SheetFooter>
            <Button type="button">Primary</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={rightOpen} onOpenChange={closeRight}>
        <SheetContent side="right">
          <SheetHeader title="SheetTitle" description="SheetDescription — side right" />
          <SheetBody>
            <P1>SheetBody content</P1>
          </SheetBody>
          <SheetFooter>
            <Button type="button">Primary</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={bottomOpen} onOpenChange={closeBottom}>
        <SheetContent side="bottom">
          <SheetHeader title="SheetTitle" description="SheetDescription — side bottom" />
          <SheetBody>
            <P1>SheetBody content</P1>
          </SheetBody>
          <SheetFooter>
            <Button type="button">Primary</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={leftOpen} onOpenChange={closeLeft}>
        <SheetContent side="left">
          <SheetHeader title="SheetTitle" description="SheetDescription — side left" />
          <SheetBody>
            <P1>SheetBody content</P1>
          </SheetBody>
          <SheetFooter>
            <Button type="button">Primary</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

interface SheetState {
  topOpen: boolean;
  openTop: () => void;
  closeTop: () => void;
  rightOpen: boolean;
  openRight: () => void;
  closeRight: () => void;
  bottomOpen: boolean;
  openBottom: () => void;
  closeBottom: () => void;
  leftOpen: boolean;
  openLeft: () => void;
  closeLeft: () => void;
}

const useSheetState = create<SheetState>((set) => ({
  topOpen: false,
  openTop: () => set(() => ({ topOpen: true })),
  closeTop: () => set(() => ({ topOpen: false })),
  rightOpen: false,
  openRight: () => set(() => ({ rightOpen: true })),
  closeRight: () => set(() => ({ rightOpen: false })),
  bottomOpen: false,
  openBottom: () => set(() => ({ bottomOpen: true })),
  closeBottom: () => set(() => ({ bottomOpen: false })),
  leftOpen: false,
  openLeft: () => set(() => ({ leftOpen: true })),
  closeLeft: () => set(() => ({ leftOpen: false }))
}));
