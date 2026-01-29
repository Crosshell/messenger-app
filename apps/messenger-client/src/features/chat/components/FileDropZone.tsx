import React, { useState, useCallback, type ReactNode } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileDropZoneProps {
  onFilesDrop: (files: FileList) => void;
  children: ReactNode;
  disabled?: boolean;
}

export const FileDropZone = ({
  onFilesDrop,
  children,
  disabled,
}: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesDrop(e.dataTransfer.files);
      }
    },
    [onFilesDrop, disabled],
  );

  return (
    <div
      className="relative flex h-full flex-1 flex-col overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="animate-in fade-in pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center border-2 border-dashed border-purple-500 bg-purple-500/10 backdrop-blur-sm duration-200">
          <UploadCloud
            size={64}
            className="mb-4 animate-bounce text-purple-600"
          />
          <p className="text-xl font-bold text-purple-700">
            Drop files to upload
          </p>
        </div>
      )}
      {children}
    </div>
  );
};
