"use client";

import { useState, ChangeEvent } from "react";

interface PhotoUploadBoxProps {
  label: string;
}

export function PhotoUploadBox({ label }: PhotoUploadBoxProps) {
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <label className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/15 bg-card-secondary p-6 text-center transition hover:border-primary/50">
      <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleChange} />

      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={label} className="h-full w-full rounded-xl object-cover" />
      ) : (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-2xl text-accent">
            📷
          </div>
          <p className="text-sm font-medium text-gray-300">{label}</p>
          <p className="text-xs text-gray-500">PNG, JPEG</p>
        </>
      )}
    </label>
  );
}