import React, { useState } from "react";

const VehiclePhotosUpload = ({ setImagePreviews }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleSelect = async (e) => {
    const files = Array.from(e.target.files);
    const previews = [];

    setIsUploading(true);

    for (const file of files) {
      const isVideo = file.type.startsWith("video/");
      const resourceType = isVideo ? "video" : "image";
      try {
        const uploadedUrl = await uploadToCloudinary(file, resourceType);
        previews.push({ url: uploadedUrl, type: isVideo ? "video" : "image", name: file.name });
      } catch (error) {
        console.error("Upload failed for", file.name, error);
      }
    }

    setImagePreviews?.((prev) => [...(prev || []), ...previews]);

    setIsUploading(false);
  };

  const uploadToCloudinary = async (file, resourceType = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "autosaledn");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/di6k4wpxl/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleSelect}
        className="mb-2"
      />
      {isUploading && (
        <p className="text-sm text-blue-600 animate-pulse">Uploading...</p>
      )}
    </div>
  );
};

export default VehiclePhotosUpload;
