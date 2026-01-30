import { useRef } from 'react';
import { Loader2, X, Camera, User as UserIcon, Trash2 } from 'lucide-react';
import { Button } from '@ui/Button';
import { Input } from '@ui/Input';
import type { User } from '@features/user/model/types/user.type';
import { FileDropZone } from '@components/FileDropZone';
import { useEditProfileForm } from '@features/user/hooks/use-edit-profile-form';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  currentUser,
}: EditProfileModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { form, avatar, isLoading, isFileUploading } = useEditProfileForm({
    currentUser,
    isOpen,
    onClose,
  });

  if (!isOpen) return null;

  const showRemoveButton = !!avatar.previewUrl && !isLoading;
  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
          <h3 className="text-lg font-semibold text-slate-800">Edit Profile</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={form.handleSubmit} className="p-6">
          <div className="mb-8 flex flex-col items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={avatar.handleFileSelect}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              className="hidden"
            />

            <div className="group relative h-28 w-28">
              <div className="relative z-10 h-full w-full overflow-hidden rounded-full border-4 border-slate-100 bg-slate-100 shadow-inner">
                <FileDropZone
                  onFilesDrop={avatar.handleFileDrop}
                  variant="compact"
                  disabled={isLoading}
                >
                  <div
                    onClick={triggerFileSelect}
                    className="relative flex h-28 w-full cursor-pointer items-center justify-center"
                  >
                    {avatar.previewUrl ? (
                      <img
                        src={avatar.previewUrl}
                        alt="Avatar"
                        className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                      />
                    ) : (
                      <UserIcon size={40} className="text-slate-400" />
                    )}

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="translate-y-2 transform opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="rounded-full bg-black/60 p-2 text-white backdrop-blur-sm">
                          <Camera size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </FileDropZone>
              </div>

              {showRemoveButton && (
                <button
                  type="button"
                  onClick={avatar.handleRemoveAvatar}
                  className="absolute -top-1 -right-1 z-20 rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Remove photo"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Click or drop image to change
            </p>

            {avatar.uploadError && (
              <p className="animate-in slide-in-from-top-1 mt-2 text-xs font-medium text-red-500">
                {avatar.uploadError}
              </p>
            )}
          </div>

          <div className="space-y-6">
            <Input
              placeholder="Enter your username"
              icon={<UserIcon size={18} />}
              disabled={isLoading}
              {...form.register('username')}
              error={form.errors.username?.message}
            />

            {form.errors.root && (
              <div className="animate-in slide-in-from-top-1 rounded-lg border border-red-100 bg-red-50 p-3 text-center">
                <p className="text-sm font-medium text-red-600">
                  {form.errors.root.message}
                </p>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading || !!avatar.uploadError}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    {isFileUploading ? 'Uploading...' : 'Saving...'}
                  </span>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
