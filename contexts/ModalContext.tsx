"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "confirm" | "createPost";

interface ModalContextProps {
  openModal: (type: ModalType, data?: unknown) => void;
  closeModal: () => void;
  modalType: ModalType | null;
  modalData: unknown;
  setOnConfirm: (onConfirm: () => void) => void;
  onConfirm: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<unknown>(null);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});

  const openModal = (type: ModalType, data: unknown = null) => {
    setModalType(type);
    setModalData(data);
  };

  const closeModal = () => {
    setModalType(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        modalType,
        modalData,
        setOnConfirm,
        onConfirm,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
