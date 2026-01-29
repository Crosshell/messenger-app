import { X, Download } from 'lucide-react';
import { useEffect } from 'react';
import { useUIStore } from '../../store/ui.store';

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
      className="fixed inset-0 z-100 bg-black/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
      onClick={() => setPreviewImage(null)}
    >
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white/80 z-10 bg-linear-to-b from-black/50 to-transparent">
        <span className="text-sm font-medium truncate max-w-50">
          {previewImage.filename}
        </span>

        <div className="flex items-center gap-2">
          <a
            href={previewImage.url}
            download={previewImage.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={20} />
          </a>
          <button
            onClick={() => setPreviewImage(null)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <img
        src={previewImage.url}
        alt={previewImage.filename}
        className="max-w-full max-h-screen object-contain p-4 transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
