import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { handleApiError } from '@shared/utils/api-error.util';
import type { UseFormSetError } from 'react-hook-form';
import type { UpdateUserPayload } from '@features/user/model/types/update-user-payload.type';

interface UseUpdateProfileProps {
  onSuccess?: () => void;
  setError: UseFormSetError<any>;
}

export const useUpdateProfile = ({
  onSuccess,
  setError,
}: UseUpdateProfileProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserPayload) => userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['users', 'me'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['chats'] });

      onSuccess?.();
    },
    onError: (error: any) => {
      handleApiError(error, setError);
    },
  });
};
