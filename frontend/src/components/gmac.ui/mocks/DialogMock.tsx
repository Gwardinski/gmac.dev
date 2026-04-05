import { create } from 'zustand';
import { Button } from '../button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '../dialog';
import { P1 } from '../typography';

export const DialogMock = () => {
  const { example1Open, closeModal1, example2Open, closeModal2, openModal1, openModal2 } = useModalState();

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={openModal1}>
          Open Modal 1
        </Button>
        <Button type="button" onClick={openModal2}>
          Open Modal 2
        </Button>
      </div>

      <Dialog open={example1Open} onOpenChange={closeModal1}>
        <DialogContent>
          <DialogHeader title="DialogTitle" description="DialogDescription" />
          <DialogBody>
            <P1>DialogBody content</P1>
          </DialogBody>
          <DialogFooter>
            <Button type="button">Primary</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={example2Open} onOpenChange={closeModal2}>
        <DialogContent>
          <DialogHeader title="DialogTitle" description="DialogDescription" />
          <DialogBody>
            <P1>DialogBody content</P1>
          </DialogBody>
          <DialogFooter>
            <Button type="button">Primary</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface ModalState {
  example1Open: boolean;
  openModal1: () => void;
  closeModal1: () => void;
  example2Open: boolean;
  openModal2: () => void;
  closeModal2: () => void;
}

const useModalState = create<ModalState>((set) => ({
  example1Open: false,
  openModal1: () => set(() => ({ example1Open: true })),
  closeModal1: () => set(() => ({ example1Open: false })),
  example2Open: false,
  openModal2: () => set(() => ({ example2Open: true })),
  closeModal2: () => set(() => ({ example2Open: false }))
}));
