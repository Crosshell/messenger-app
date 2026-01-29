import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service.ts';
import { useState } from 'react';
import { useDebounce } from '@shared/hooks/use-debounce.ts';

export const useSearchUsers = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', 'search', debouncedQuery],
    queryFn: () => userService.searchUsers(debouncedQuery, 1),
    enabled: debouncedQuery.length >= 3,
  });

  return {
    query,
    setQuery,
    users: data?.data || [],
    isLoading,
    isError,
  };
};
