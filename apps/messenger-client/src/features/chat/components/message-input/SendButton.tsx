import { Check, Loader2, Send } from 'lucide-react';

interface SendButtonProps {
  isUploading: boolean;
  isEditing: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const SendButton = ({
  isUploading,
  isEditing,
  disabled,
  onClick,
}: SendButtonProps) => {
  const getIcon = () => {
    if (isUploading) return <Loader2 size={20} className="animate-spin" />;
    if (isEditing) return <Check size={20} />;
    return <Send size={20} />;
  };

  const getBgColor = () => {
    if (disabled) return 'bg-slate-400 cursor-not-allowed opacity-50';
    if (isEditing) return 'bg-green-500 hover:bg-green-600';
    return 'bg-purple-600 hover:bg-purple-700';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mb-0.5 rounded-xl p-2 text-white shadow-sm transition-all ${getBgColor()}`}
    >
      {getIcon()}
    </button>
  );
};
