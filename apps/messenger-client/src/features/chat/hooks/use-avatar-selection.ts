import React, { useState, useCallback, type ChangeEvent } from 'react';
import { useAttachments } from '@features/chat/hooks/use-attachments';

interface UseAvatarSelectionProps {
  initialAvatarUrl?: string;
  onError: (message: string) => void;
  clearError: () => void;
}

export const useAvatarSelection = ({
  initialAvatarUrl,
  onError,
  clearError,
}: UseAvatarSelectionProps) => {
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);

  const {
    files,
    addFiles,
    uploadFiles,
    isUploading,
    removeFile,
    clearFiles,
    error: uploadError,
  } = useAttachments();

  const validateAndAddFile = useCallback(
    (fileList: FileList | File[]) => {
      clearError();
      setIsAvatarRemoved(false);

      const filesArray = Array.from(fileList);
      const invalidFiles = filesArray.filter(
        (file) => !file.type.startsWith('image/'),
      );

      if (invalidFiles.length > 0) {
        onError('Only image files are allowed');
        return;
      }

      if (filesArray.length > 0) {
        addFiles([filesArray[0]]);
      }
    },
    [addFiles, onError, clearError],
  );

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndAddFile(e.target.files);
    }
    e.target.value = '';
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length > 0) {
      removeFile(0);
    } else {
      setIsAvatarRemoved(true);
    }
  };

  const resetAvatarState = useCallback(() => {
    clearFiles();
    setIsAvatarRemoved(false);
  }, [clearFiles]);

  let previewUrl = initialAvatarUrl;
  if (files.length > 0) {
    previewUrl = URL.createObjectURL(files[0]);
  } else if (isAvatarRemoved) {
    previewUrl = undefined;
  }

  return {
    fileToUpload: files[0],
    isAvatarRemoved,
    isUploading,
    uploadError,
    previewUrl,
    handleFileDrop: validateAndAddFile,
    handleFileSelect,
    handleRemoveAvatar,
    resetAvatarState,
    uploadFiles,
  };
};
