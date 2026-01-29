import { Download, X } from 'lucide-react';
import { useEffect } from 'react';
import { useUIStore } from '../store/ui.store.ts';

export const ImagePreviewModal = () => {
  const { previewImage, setPreviewImage } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setPreviewImage]);

  if (!previewImage) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm duration-200"
      onClick={() => setPreviewImage(null)}
    >
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between bg-linear-to-b from-black/50 to-transparent p-4 text-white/80">
        <span className="max-w-50 truncate text-sm font-medium">
          {previewImage.filename}
        </span>

        <div className="flex items-center gap-2">
          <a
            href={previewImage.url}
            download={previewImage.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 transition-colors hover:bg-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={20} />
          </a>
          <button
            onClick={() => setPreviewImage(null)}
            className="rounded-full p-2 transition-colors hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <img
        src={previewImage.url}
        alt={previewImage.filename}
        className="max-h-screen max-w-full scale-100 object-contain p-4 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
