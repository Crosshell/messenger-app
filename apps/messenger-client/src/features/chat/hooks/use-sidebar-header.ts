import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/model/auth.store';
import { userService } from '@features/user/services/user.service';

export const useSidebarHeader = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: userService.getMe,
    staleTime: 1000 * 60 * 5,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    currentUser,
    isLoading,
    modals: {
      isCreateOpen: isCreateModalOpen,
      setCreateOpen: setIsCreateModalOpen,
      isProfileOpen: isProfileModalOpen,
      setProfileOpen: setIsProfileModalOpen,
    },
    handleLogout,
  };
};
