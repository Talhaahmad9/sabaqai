"use client";

import { useState } from "react";
import UploadModal from "@/components/dashboard/UploadModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) return "Yesterday";
  return then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFileSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadCloudIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
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
  );
}

function DocumentIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function MaterialCard({ material, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/materials/${material._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onDelete(material._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          title="Delete Material"
          message={`Are you sure you want to delete "${material.fileName}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          loading={deleting}
        />
      )}

      <div className="bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl p-4 flex items-center gap-4 transition-colors group">
        <div className="bg-red-900/40 rounded-lg p-2 shrink-0">
          <DocumentIcon className="h-6 w-6 text-red-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{material.fileName}</p>
          <p className="text-xs mt-0.5">
            <span className="text-violet-400">
              {material.subject ?? "No subject"}
            </span>
            <span className="text-slate-500">
              {" "}
              · {formatFileSize(material.fileSize)}
            </span>
          </p>
        </div>

        <span className="text-slate-500 text-xs shrink-0">
          {timeAgo(material.uploadedAt)}
        </span>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-900/40 text-slate-500 hover:text-red-400 disabled:opacity-50"
          aria-label="Delete material"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}

export default function UploadedMaterials({ materials }) {
  const [showModal, setShowModal] = useState(false);
  const [localMaterials, setLocalMaterials] = useState(materials ?? []);

  function handleDelete(deletedId) {
    setLocalMaterials((prev) => prev.filter((m) => m._id !== deletedId));
  }

  const hasMaterials = localMaterials.length > 0;

  return (
    <>
      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      <div className="space-y-3">
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-600 hover:border-violet-500 hover:bg-violet-500/10 text-slate-400 hover:text-violet-400 transition-colors text-sm font-medium"
        >
          <UploadCloudIcon className="h-4 w-4" />
          Upload File
        </button>

        {hasMaterials ? (
          <>
            {localMaterials.slice(0, 5).map((material) => (
              <MaterialCard
                key={material._id}
                material={material}
                onDelete={handleDelete}
              />
            ))}
            {localMaterials.length > 5 && (
              <div className="flex justify-center pt-1">
                <button className="text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg px-4 py-2 transition-colors">
                  View all materials
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-slate-400 text-sm">No materials uploaded yet</p>
            <p className="text-slate-500 text-xs mt-1">
              Upload your lecture files to get started
            </p>
          </div>
        )}
      </div>
    </>
  );
}
