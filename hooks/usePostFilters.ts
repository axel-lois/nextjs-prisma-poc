import { useState, useMemo } from 'react';
import { Post } from '@/types';
import { searchPosts } from '@/lib/search';
import { ITEMS_PER_PAGE } from '@/constants';

export function usePostFilters(posts: Post[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    return searchPosts(posts, searchQuery);
  }, [posts, searchQuery]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  }, [filteredPosts]);

  // Get paginated posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    filteredPosts,
    paginatedPosts,
    totalPages,
  };
}
