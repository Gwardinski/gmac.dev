import { create } from 'zustand';
import { Button } from '../button';
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '../drawer';
import { P1 } from '../typography';

export const DrawerExample = () => {
  const { topOpen, rightOpen, bottomOpen, leftOpen, closeTop, closeRight, closeBottom, closeLeft, openTop, openRight, openBottom, openLeft } = useDrawerState();

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

      <Drawer open={topOpen} onOpenChange={closeTop}>
        <DrawerContent side="top">
          <DrawerHeader title="DrawerTitle" description="DrawerDescription — side top" />
          <DrawerBody>
            <P1>DrawerBody content</P1>
          </DrawerBody>
          <DrawerFooter>
            <Button type="button">Primary</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={rightOpen} onOpenChange={closeRight}>
        <DrawerContent side="right">
          <DrawerHeader title="DrawerTitle" description="DrawerDescription — side right" />
          <DrawerBody>
            <P1>DrawerBody content</P1>
          </DrawerBody>
          <DrawerFooter>
            <Button type="button">Primary</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={bottomOpen} onOpenChange={closeBottom}>
        <DrawerContent side="bottom">
          <DrawerHeader title="DrawerTitle" description="DrawerDescription — side bottom" />
          <DrawerBody>
            <P1>DrawerBody content</P1>
          </DrawerBody>
          <DrawerFooter>
            <Button type="button">Primary</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={leftOpen} onOpenChange={closeLeft}>
        <DrawerContent side="left">
          <DrawerHeader title="DrawerTitle" description="DrawerDescription — side left" />
          <DrawerBody>
            <P1>DrawerBody content</P1>
          </DrawerBody>
          <DrawerFooter>
            <Button type="button">Primary</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

interface DrawerState {
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

const useDrawerState = create<DrawerState>((set) => ({
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
