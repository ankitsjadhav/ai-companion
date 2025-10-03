"use client";

import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ImageUpload = ({ value, onChange, disabled }) => {
  console.log("Current value:", value);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4 flex flex-col justify-center items-center w-full">
      <CldUploadButton
        onSuccess={(result) => {
          console.log("Upload successful:", result);
          console.log("URL being passed:", result.info.secure_url);
          onChange(result.info.secure_url);
        }}
        onError={(error) => {
          console.error("Upload failed:", error);
        }}
        options={{
          maxFiles: 1,
        }}
        uploadPreset="o6rfx7hi"
      >
        <div className="p-4 border-4 border-dashed rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
          <div className="relative h-40 w-40">
            <Image
              fill
              alt="Upload"
              src={value || "/placeholder.png"}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};
