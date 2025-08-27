"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useModal } from "@/contexts/ModalContext";
import { CreatePostForm } from "@/components/posts/CreatePostForm";

export function PostModal() {
  const { modalType, closeModal, onConfirm } = useModal();

  if (!modalType) {
    return null;
  }

  return (
    <Dialog open={!!modalType} onClose={closeModal} fullWidth maxWidth="sm">
      {modalType === "confirm" && (
        <>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to perform this action?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal}>Cancel</Button>
            <Button onClick={onConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </>
      )}
      {modalType === "createPost" && <CreatePostForm />}
    </Dialog>
  );
}
