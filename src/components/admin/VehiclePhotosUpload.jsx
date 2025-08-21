import React, { useRef } from "react";

export default function VehiclePhotosUpload({ files, setFiles, previews, setPreviews }) {
  const fileInputRef = useRef();

  // Handle file selection: update file and preview states
  const handleSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    const newPreviews = selected.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove file, preview, and file name
  const handleRemove = (idx) => {
    // First remove the preview URL to free up memory
    URL.revokeObjectURL(previews[idx]);
    
    // Then update state
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // View image in new tab
  const handleView = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleSelect}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 file:transition-colors"
      />
      {/* List of selected file names + remove */}
      <div className="flex flex-wrap items-center gap-3 mt-3">
        {files.map((file, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="text-sm">{file.name}</span>
            <button
              type="button"
              className="text-red-500 hover:text-red-700 ml-1"
              onClick={() => handleRemove(i)}
              aria-label="Remove"
              title="Remove this image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {/* Show image preview grid */}
      <div className="grid grid-cols-4 gap-3 mt-3">
        {previews.map((url, i) => (
          <div key={i} className="relative group">
            <img
              src={url}
              alt={`Vehicle ${i + 1}`}
              className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm cursor-pointer"
              onClick={() => handleView(url)}
              title="Click to view"
            />
          </div>
        ))}
      </div>
      {previews.length > 0 && (
        <div className="text-xs text-gray-400 mt-2">Click image to view. Click × to remove.</div>
      )}
    </div>
  );
}