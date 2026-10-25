import { useCallback } from "react";
import { create } from "zustand";

interface ModalState {
  activeModal: string | null;
  data: object;
}

interface ModalActions {
  onModalOpen: (toOpen: string, data?: object) => void;
  onModalClose: (toClose?: string) => void;
  updateModalData: (data: object) => void;
  isOpen: (modalName: string) => boolean;
}

type ModalStore = ModalState & ModalActions;

const createModalStore = () =>
  create<ModalStore>()((set, get) => ({
    activeModal: null,
    data: {},
    onModalOpen: (toOpen, data) => {
      set({
        activeModal: toOpen,
        data: data,
      });
    },
    onModalClose: (toClose) => {
      if (!toClose) {
        set({ activeModal: null, data: {} });
        return;
      }
      set((state) => {
        if (state.activeModal !== toClose) {
          return state;
        }
        return {
          activeModal: null,
          data: {},
        };
      });
    },
    updateModalData: (data) => set({ data }),
    isOpen: (modalName) => get().activeModal === modalName,
  }));

const modalStore = createModalStore();

/**
 * returns `isOpen` as a value to check a  modal
 * @example
 * const { isOpen } = useModalIsOpen('UserProfile')
 * if (isOpen) {
 *   // modal is open
 * }
 */
export function useModalIsOpen<T extends string>(modalName: T): { isOpen: boolean } {
  const activeModal = modalStore((state) => state.activeModal);
  return {
    isOpen: activeModal === modalName,
  };
}

/**
 * returns `onOpen` as a function without an argument that opens a  modal
 * @example
 * const { onOpen } = useModalOnOpen('UserProfile')
 * onOpen({ someData: 'value' })
 */
export function useModalOnOpen<T extends string, TData extends object = object>(modalName: T): { onOpen: (data?: TData) => void } {
  const onOpen = modalStore((state) => state.onModalOpen);
  return {
    onOpen: useCallback((data?: TData) => onOpen(modalName, data), [onOpen, modalName]),
  };
}

/**
 * returns `onClose` as a function without an argument that closes a  modal
 * @example
 * const { onClose } = useModalOnClose('UserProfile')
 * onClose()
 */
export function useModalOnClose<T extends string>(modalName: T): { onClose: () => void } {
  const onClose = modalStore((state) => state.onModalClose);
  return {
    onClose: useCallback(() => onClose(modalName), [onClose, modalName]),
  };
}

/**
 * useModalData to get the data of a  modal
 * @example
 * const { data } = useModalData<{ cost: value }>('UserProfile')
 * console.log(data.value)
 */
export function useModalData<TData = unknown>(): { data: TData } {
  return {
    data: modalStore((state) => state.data as TData),
  };
}

/**
 * useUpdateModalData to update the data of the currently open modal
 * @example
 * const { updateData } = useUpdateModalData()
 * updateData({ newValue: 'updated' })
 */
export function useUpdateModalData(): { updateData: (data: object) => void } {
  const updateModalData = modalStore((state) => state.updateModalData);
  return {
    updateData: useCallback((data: object) => updateModalData(data), [updateModalData]),
  };
}
