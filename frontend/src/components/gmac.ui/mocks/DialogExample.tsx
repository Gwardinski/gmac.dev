import { create } from 'zustand';
import { Button } from '../button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '../dialog';
import { P1 } from '../typography';

export const DialogExample = () => {
  const { modalOpen, closeModal, openModal } = useModalState();

  return (
    <>
      <Button type="button" onClick={openModal}>
        Open Modal
      </Button>

      <Dialog open={modalOpen} onOpenChange={closeModal}>
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
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useModalState = create<ModalState>((set) => ({
  modalOpen: false,
  openModal: () => set(() => ({ modalOpen: true })),
  closeModal: () => set(() => ({ modalOpen: false }))
}));
