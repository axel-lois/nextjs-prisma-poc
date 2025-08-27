"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Post } from "@/types";
import { useModal } from "@/contexts/ModalContext";

interface PostCardProps {
  post: Post;
  onUpdate: (id: number, data: { title?: string; body?: string }) => void;
  onDelete: (id: number) => void;
}

export function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
  const { setOnConfirm, onConfirmOpen, onConfirmClose } = useModal();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedBody, setEditedBody] = useState(post.body);
  const [isLoading] = useState(false);

  const handleUpdate = () => {
    if (editedTitle === post.title && editedBody === post.body) {
      setIsEditing(false);
      return;
    }

    setOnConfirm(() => () => {
      onUpdate(post.id, {
        title: editedTitle,
        body: editedBody,
      });
      setIsEditing(false);
      onConfirmClose();
    });
    onConfirmOpen();
  };

  const handleCancelEdit = () => {
    setEditedTitle(post.title);
    setEditedBody(post.body);
    setIsEditing(false);
  };

  return (
    <Card sx={{ height: 350, display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
        {isEditing ? (
          <>
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              variant="outlined"
              fullWidth
              label="Title"
              sx={{ mb: 2 }}
            />
            <TextField
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              label="Content"
            />
          </>
        ) : (
          <>
            <Typography variant="h5" component="div" noWrap>
              {post.title}
            </Typography>
            {post.user && (
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                by {post.user.name}
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {post.body}
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions>
        {isEditing ? (
          <>
            <Button size="small" onClick={handleUpdate} disabled={isLoading}>
              Save
            </Button>
            <Button
              size="small"
              onClick={handleCancelEdit}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <IconButton onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(post.id)}>
              <Delete />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );
}
