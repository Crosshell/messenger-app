import { useCallback, useEffect, useState } from 'react';
import { storageService } from '@shared/services/storage.service';
import type { Attachment } from '../model/types/attachment.type';
import {
  MAX_ATTACHMENT_SIZE,
  MAX_ATTACHMENTS,
} from '@shared/constants/app.constants';

export const useAttachments = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(
    [],
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null);
      const validFiles: File[] = [];

      Array.from(newFiles).forEach((file) => {
        if (file.size > MAX_ATTACHMENT_SIZE) {
          setError(`File ${file.name} is too large (max 10MB)`);
          return;
        }
        validFiles.push(file);
      });

      setFiles((prev) => {
        if (
          prev.length + validFiles.length + existingAttachments.length >
          MAX_ATTACHMENTS
        ) {
          setError(`You can only attach up to ${MAX_ATTACHMENTS} files`);
          return prev;
        }
        return [...prev, ...validFiles];
      });
    },
    [files.length, existingAttachments.length],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removeExistingAttachment = useCallback((id: string) => {
    setExistingAttachments((prev) => prev.filter((att) => att.id !== id));
  }, []);

  const loadAttachments = useCallback((attachments: Attachment[]) => {
    setExistingAttachments(attachments);
    setFiles([]);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setExistingAttachments([]);
    setError(null);
  }, []);

  const uploadFiles = async (): Promise<Attachment[]> => {
    setIsUploading(true);
    setError(null);

    const uploadedAttachments: Attachment[] = [...existingAttachments];

    try {
      if (files.length > 0) {
        const newAttachments = await storageService.uploadFiles(files);
        uploadedAttachments.push(...newAttachments);
      }
      return uploadedAttachments;
    } catch (err) {
      console.error(err);
      setError('Failed to upload files');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    files,
    existingAttachments,
    addFiles,
    removeFile,
    removeExistingAttachment,
    loadAttachments,
    clearFiles,
    uploadFiles,
    isUploading,
    error,
  };
};
