'use client';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useModal } from '@/contexts/ModalContext';

export function PostModal() {
  const { isConfirmOpen, onConfirmClose, onConfirm } = useModal();

  return (
    <>
      <Dialog
        open={isConfirmOpen}
        onClose={onConfirmClose}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to perform this action?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onConfirmClose}>Cancel</Button>
          <Button onClick={onConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
