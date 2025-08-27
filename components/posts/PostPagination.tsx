'use client';

import { Pagination, Box } from '@mui/material';

interface PostPaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function PostPagination({ totalPages, currentPage, setCurrentPage }: PostPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, pb: 4 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => setCurrentPage(page)}
        color="primary"
      />
    </Box>
  );
}
