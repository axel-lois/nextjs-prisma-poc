'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextProps {
  setOnConfirm: (onConfirm: () => void) => void;
  onConfirmOpen: () => void;
  onConfirmClose: () => void;
  isConfirmOpen: boolean;
  onConfirm: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const onConfirmOpen = () => {
    setIsConfirmOpen(true);
  };

  const onConfirmClose = () => {
    setIsConfirmOpen(false);
  };

  return (
    <ModalContext.Provider value={{ setOnConfirm, onConfirmOpen, onConfirmClose, isConfirmOpen, onConfirm }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
