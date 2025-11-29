'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadAvatar, removeAvatar } from '@/app/actions/settings';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getUserInitials } from '@/lib/utils/format';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  username: string;
  onAvatarChange?: (avatarUrl: string | null) => void;
}

export function AvatarUpload({
  currentAvatarUrl,
  username,
  onAvatarChange,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG or PNG image',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const result = await uploadAvatar(formData);

      if (result.success && result.data) {
        setAvatarUrl(result.data.avatar_url);
        onAvatarChange?.(result.data.avatar_url);
        toast({
          title: 'Success',
          description: result.message || 'Avatar updated successfully',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description:
          error instanceof Error ? error.message : 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);

    try {
      const result = await removeAvatar();

      if (result.success) {
        setAvatarUrl(null);
        onAvatarChange?.(null);
        toast({
          title: 'Success',
          description: result.message || 'Avatar removed successfully',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Failed to remove avatar',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
      {/* Avatar Preview */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-slate-200">
          <AvatarImage src={avatarUrl || undefined} alt={username} />
          <AvatarFallback className="bg-brand-100 text-brand-700 text-xl sm:text-2xl font-semibold">
            {getUserInitials(username)}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="flex-1 w-full space-y-3 sm:space-y-4">
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors',
            dragActive
              ? 'border-brand-500 bg-brand-50'
              : 'border-slate-300 hover:border-brand-400',
            isUploading && 'opacity-50 pointer-events-none'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
            disabled={isUploading}
          />
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-slate-100 p-2 sm:p-3">
                <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
              </div>
            </div>
            <div className="text-xs sm:text-sm">
              <button
                type="button"
                onClick={handleClick}
                disabled={isUploading}
                className="font-medium text-brand-600 hover:text-brand-700 focus:outline-none"
              >
                Click to upload
              </button>
              <span className="text-slate-600"> or drag and drop</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500">
              PNG or JPG up to 5MB
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={isUploading}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Upload Photo
              </>
            )}
          </Button>
          {avatarUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={isRemoving || isUploading}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              {isRemoving ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <X className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Remove
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
