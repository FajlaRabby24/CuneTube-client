"use client";

import { CircleUserRoundIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-uplaod";
import Image from "next/image";
import { useEffect } from "react";

interface ImagePreviewProps {
  onFileChange?: (file: File | null) => void;
  className?: string;
}

export default function ImagePreview({
  onFileChange,
  className,
}: ImagePreviewProps) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  useEffect(() => {
    onFileChange?.(files[0]?.file instanceof File ? files[0].file : null);
  }, [files, onFileChange]);

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  return (
    <div className="flex flex-col  gap-2">
      <div className="inline-flex items-center gap-2 align-top">
        <div
          aria-label={previewUrl ? "Upload preview" : "Default user avatar"}
          className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input"
        >
          {previewUrl ? (
            <Image
              alt="Upload preview"
              className="size-full object-cover"
              height={32}
              src={previewUrl}
              width={32}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="opacity-60" size={16} />
            </div>
          )}
        </div>
        <div className="relative inline-block">
          <Button
            type="button"
            className="cursor-pointer"
            aria-haspopup="dialog"
            onClick={openFileDialog}
          >
            {fileName ? "Change image" : "Upload image"}
          </Button>
          <input
            {...getInputProps()}
            aria-label="Upload image file"
            className="sr-only"
            tabIndex={-1}
          />
        </div>
      </div>
      {fileName && (
        <div className="inline-flex gap-2 text-xs">
          <p aria-live="polite" className="truncate text-muted-foreground">
            {fileName}
          </p>{" "}
          <button
            aria-label={`Remove ${fileName}`}
            className="font-medium text-destructive hover:underline cursor-pointer"
            onClick={() => removeFile(files[0]?.id)}
            type="button"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
