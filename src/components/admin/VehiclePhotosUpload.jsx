import React, { useRef } from "react";

export default function VehiclePhotosUpload({ 
  imageFiles = [], // Default to empty array
  setImageFiles, 
  imagePreviews = [], // Default to empty array
  setImagePreviews 
}) {
  const fileInputRef = useRef();

  // Handle file selection: update file and preview states
  const handleSelect = (e) => {
    const selected = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...selected]);
    const newPreviews = selected.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type // Store file type for conditional rendering
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove file, preview, and file name
  const handleRemove = (idx) => {
    // First remove the preview URL to free up memory
    if (imagePreviews[idx] && imagePreviews[idx].url) {
      URL.revokeObjectURL(imagePreviews[idx].url);
    }
    
    // Then update state
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // View media in new tab
  const handleView = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleSelect}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 file:transition-colors"
      />
      {/* List of selected file names + remove */}
      <div className="flex flex-wrap items-center gap-3 mt-3">
        {imageFiles.map((file, i) => ( // Changed 'files' to 'imageFiles'
          <div key={i} className="flex items-center gap-1">
            <span className="text-sm">{file.name}</span>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 ml-1"
              onClick={() => handleRemove(i)}
              aria-label="Remove"
              title="Remove this file"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {/* Show media preview grid */}
      <div className="grid grid-cols-4 gap-3 mt-3">
        {imagePreviews.map((previewItem, i) => ( // Changed 'previews' to 'imagePreviews'
          <div key={i} className="relative group">
            {previewItem.type.startsWith('image/') ? (
              <img
                src={previewItem.url}
                alt={`Vehicle media ${i + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                onClick={() => handleView(previewItem.url)}
                title="Click to view"
              />
            ) : (previewItem.type.startsWith('video/') && (
              <video
                src={previewItem.url}
                alt={`Vehicle video ${i + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                controls={false}
                preload="metadata"
                onClick={() => handleView(previewItem.url)}
                title="Click to view video"
              />
            ))}
            {/* Optional: Add a play icon overlay for videos */}
            {previewItem.type.startsWith('video/') && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg cursor-pointer"
                onClick={() => handleView(previewItem.url)}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      {imagePreviews.length > 0 && ( // Changed 'previews.length' to 'imagePreviews.length'
        <div className="text-xs text-gray-400 mt-2">Click media to view. Click × to remove.</div>
      )}
    </div>
  );
}