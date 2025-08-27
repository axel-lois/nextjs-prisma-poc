"use client";

import { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { PostCard } from "@/components/posts/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { useModal } from "@/contexts/ModalContext";
import { Post } from "@/types";
import { PostSearch } from "./PostSearch";
import { PostPagination } from "./PostPagination";
import Fuse from "fuse.js";
import { FUSE_THRESHOLD, ITEMS_PER_PAGE } from "@/constants";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { getQueuedRequests } from "@/lib/offline";
import { useIsRestoring } from "@tanstack/react-query";

export function PostList() {
  const { posts, updatePost, deletePost, isLoading, error, addRequestToQueue } =
    usePosts();
  const { openModal, closeModal, setOnConfirm } = useModal();
  const [searchQuery, setSearchQuery] = useState("");
  const isOnline = useOnlineStatus();
  const queuedRequests = getQueuedRequests();
  const [currentPage, setCurrentPage] = useState(1);
  const isRestoring = useIsRestoring();

  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: ["title", "body", "user.name"],
      threshold: FUSE_THRESHOLD,
      includeScore: true,
    });
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (searchQuery.trim() === "") {
      return posts;
    }
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, posts, fuse]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  }, [filteredPosts]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  // Handle delete post
  const handleDeletePostClick = (post: Post) => {
    setOnConfirm(() => () => {
      deletePost(post.id);
      closeModal();
    });
    openModal("confirm");
  };

  // Handle update with modal sync
  const handleUpdate = (
    id: number,
    data: { title?: string; body?: string }
  ) => {
    updatePost({ id, ...data });
  };

  if (isLoading || isRestoring) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Card sx={{ maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h5" color="error" gutterBottom>
              Error
            </Typography>
            <Typography>{error.message}</Typography>
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Posts Management System
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Browse, search, and manage all posts
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <PostSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Button variant="contained" onClick={() => openModal("createPost")}>
          Add Post
        </Button>
      </Box>

      {!isOnline && (
        <Box
          sx={{
            my: 2,
            p: 2,
            bgcolor: "warning.main",
            color: "white",
            borderRadius: 1,
          }}
        >
          <Typography>
            You are currently offline. Changes will be synced when you are back
            online. Queued items: {queuedRequests.length}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {paginatedPosts.map((post) => (
          <Box key={post.id} sx={{ width: "calc(33.333% - 16px)" }}>
            <PostCard
              post={post}
              onUpdate={handleUpdate}
              onDelete={() => handleDeletePostClick(post)}
              addRequestToQueue={addRequestToQueue}
            />
          </Box>
        ))}
      </Box>

      <PostPagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Container>
  );
}
