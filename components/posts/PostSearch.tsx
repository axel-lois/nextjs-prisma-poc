'use client';

import { TextField, Button } from '@mui/material';
import { Box } from '@mui/system';

interface PostSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function PostSearch({ searchQuery, setSearchQuery }: PostSearchProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by title, content, or author..."
        variant="outlined"
        sx={{ width: '100%', maxWidth: 500 }}
      />
      <Button
        variant="contained"
        onClick={() => (window.location.href = '/posts/create')}
      >
        Add Post
      </Button>
    </Box>
  );
}
