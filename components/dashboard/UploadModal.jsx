"use client";

import { useRef, useState } from "react";

export default function UploadModal({ onClose, onSuccess }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    if (f) setFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0] ?? null;
    if (f) setFile(f);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  async function handleUpload() {
    setError("");

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and PowerPoint files are allowed.");
      return;
    }

    setUploading(true);

    try {
      // Step 1 — get presigned URL
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          subject: subject || "General",
        }),
      });

      const { url, key } = await presignRes.json();
      if (!presignRes.ok || !url) {
        setError("Failed to get upload URL.");
        return;
      }

      // Step 2 — upload directly to S3
      const s3Res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!s3Res.ok) {
        setError("Upload to S3 failed.");
        return;
      }

      // Step 3 — save metadata to DB and trigger KB sync
      const metaRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          s3Key: key,
          subject: subject || "General",
        }),
      });

      const metaData = await metaRes.json();
      if (!metaRes.ok) {
        setError(metaData.message || "Failed to save file metadata.");
        return;
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Upload error", err);
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onClose?.()}
      />

      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 p-6 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Upload Material
            </h3>
            <button
              onClick={() => onClose?.()}
              className="text-slate-400 hover:text-white p-1 rounded"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-violet-500 bg-violet-500/10" : "border-slate-600"}`}
            onClick={openFilePicker}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.ppt,.pptx"
              className="hidden"
              onChange={handleFileChange}
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-auto text-slate-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            {file ? (
              <p className="text-violet-400 text-sm font-medium">{file.name}</p>
            ) : (
              <>
                <p className="text-slate-400 text-sm">
                  Drag a PDF or PowerPoint here or click to browse
                </p>
                <p className="text-slate-500 text-xs mt-2">Maximum size 10MB</p>
              </>
            )}
          </div>

          <div className="mt-4">
            <label className="text-slate-300 text-sm mb-1 block">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Control Systems"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="mt-4 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold"
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Uploading...
              </div>
            ) : (
              "Upload File"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
