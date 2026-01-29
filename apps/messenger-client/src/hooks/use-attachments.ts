import { useState, useCallback, useEffect } from 'react';
import { storageService } from '../services/storage.service';
import type { Attachment } from '../types/attachment.type';

const MAX_FILES = 5;
const MAX_SIZE = 10 * 1024 * 1024;

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
        if (file.size > MAX_SIZE) {
          setError(`File ${file.name} is too large (max 10MB)`);
          return;
        }
        validFiles.push(file);
      });

      setFiles((prev) => {
        if (
          prev.length + validFiles.length + existingAttachments.length >
          MAX_FILES
        ) {
          setError(`You can only attach up to ${MAX_FILES} files`);
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
        await Promise.all(
          files.map(async (file) => {
            const { uploadUrl, fileUrl } =
              await storageService.getPresignedUrl(file);
            await storageService.uploadToS3(uploadUrl, file);
            uploadedAttachments.push({
              url: fileUrl,
              filename: file.name,
              mimeType: file.type,
              size: file.size,
            });
          }),
        );
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
