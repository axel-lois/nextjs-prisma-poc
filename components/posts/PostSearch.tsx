"use client";

import { TextField } from "@mui/material";
import { Box } from "@mui/system";

interface PostSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function PostSearch({ searchQuery, setSearchQuery }: PostSearchProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: 2,
      }}
    >
      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by title, content, or author..."
        variant="outlined"
        sx={{ width: "100%", maxWidth: 500 }}
      />
    </Box>
  );
}
