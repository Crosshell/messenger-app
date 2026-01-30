import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@features/user/model/types/user.type';
import { useUpdateProfile } from './use-update-profile';
import { useAvatarSelection } from '../../chat/hooks/use-avatar-selection';
import {
  editProfileSchema,
  type EditProfileFormData,
} from '../model/validators/edit-profile.validator';

interface UseEditProfileFormProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
}

export const useEditProfileForm = ({
  currentUser,
  isOpen,
  onClose,
}: UseEditProfileFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { username: currentUser.username },
    mode: 'onTouched',
  });

  const avatar = useAvatarSelection({
    initialAvatarUrl: currentUser.avatarUrl,
    onError: (msg) => setError('root', { message: msg }),
    clearError: () => clearErrors('root'),
  });

  const { mutate: updateProfile, isPending: isProfileUpdating } =
    useUpdateProfile({
      setError,
      onSuccess: () => {
        onClose();
        avatar.resetAvatarState();
      },
    });

  useEffect(() => {
    if (isOpen) {
      reset({ username: currentUser.username });
      avatar.resetAvatarState();
      clearErrors();
    }
  }, [isOpen, currentUser, reset, clearErrors]);

  const onSubmit = async (data: EditProfileFormData) => {
    let avatarUrl: string | null | undefined = currentUser.avatarUrl;

    if (avatar.fileToUpload) {
      try {
        const uploaded = await avatar.uploadFiles();
        if (uploaded.length > 0) {
          avatarUrl = uploaded[0].url;
        }
      } catch (e) {
        return;
      }
    } else if (avatar.isAvatarRemoved) {
      avatarUrl = null;
    }

    if (
      data.username === currentUser.username &&
      avatarUrl === currentUser.avatarUrl
    ) {
      onClose();
      return;
    }

    updateProfile({
      username: data.username,
      avatarUrl: avatarUrl,
    });
  };

  return {
    form: {
      register,
      errors,
      handleSubmit: handleSubmit(onSubmit),
    },
    avatar,
    isLoading: avatar.isUploading || isProfileUpdating,
    isFileUploading: avatar.isUploading,
  };
};
