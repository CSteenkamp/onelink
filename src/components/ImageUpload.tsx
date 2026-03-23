"use client";

import { useState, useRef } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageUploadProps {
  currentImageUrl: string;
  onImageChange: (url: string) => void;
  imageType: "avatar" | "header";
  label: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageChange,
  imageType,
  label,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File must be under 5MB.");
      return;
    }

    setUploading(true);
    try {
      // Get presigned URL
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          imageType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to get upload URL.");
        setUploading(false);
        return;
      }

      const { presignedUrl, publicUrl } = await res.json();

      // Upload directly to S3
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        setError("Failed to upload image.");
        setUploading(false);
        return;
      }

      onImageChange(publicUrl);
    } catch {
      setError("Upload failed. Please try again.");
    }
    setUploading(false);

    // Reset input so same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemove() {
    onImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const isAvatar = imageType === "avatar";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div
          className={`flex-shrink-0 overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center ${
            isAvatar
              ? "w-20 h-20 rounded-full"
              : "w-32 h-20 rounded-lg"
          }`}
        >
          {currentImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={currentImageUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-xs text-center px-1">
              {isAvatar ? "No avatar" : "No image"}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : currentImageUrl ? "Change" : "Upload"}
          </button>
          {currentImageUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}
