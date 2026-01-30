import { useState } from 'react';
import { Smile } from 'lucide-react';
import EmojiPicker, {
  type EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';

interface EmojiPickerButtonProps {
  onEmojiSelect: (emojiData: EmojiClickData) => void;
  disabled?: boolean;
}

export const EmojiPickerButton = ({
  onEmojiSelect,
  disabled,
}: EmojiPickerButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 bottom-12 z-20 shadow-xl">
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                onEmojiSelect(emojiData);
              }}
              theme={Theme.LIGHT}
              emojiStyle={EmojiStyle.APPLE}
              lazyLoadEmojis={true}
              height={350}
              width={300}
              previewConfig={{ showPreview: false }}
            />
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`mb-0.5 rounded-full p-2 transition-colors hover:bg-slate-200 ${
          isOpen
            ? 'bg-slate-200 text-yellow-500'
            : 'text-slate-400 hover:text-yellow-500'
        } disabled:opacity-50`}
      >
        <Smile size={20} />
      </button>
    </div>
  );
};
