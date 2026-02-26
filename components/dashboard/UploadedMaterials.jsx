function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days === 1) return 'Yesterday';
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFileSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadCloudIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center gap-3">
      <UploadCloudIcon className="h-10 w-10 text-slate-600" />
      <p className="text-slate-400 font-medium">No materials uploaded yet</p>
      <p className="text-slate-500 text-sm text-center">
        Upload your lecture PDFs to get started
      </p>
    </div>
  );
}

function MaterialCard({ material }) {
  return (
    <div className="bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl p-4 flex items-center gap-4 transition-colors">
      {/* PDF icon box */}
      <div className="bg-red-900/40 rounded-lg p-2 shrink-0">
        <DocumentIcon className="h-6 w-6 text-red-400" />
      </div>

      {/* Middle: name + meta */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{material.fileName}</p>
        <p className="text-xs mt-0.5">
          <span className="text-violet-400">{material.subject ?? 'No subject'}</span>
          <span className="text-slate-500"> · {formatFileSize(material.fileSize)}</span>
        </p>
      </div>

      {/* Right: upload date */}
      <span className="text-slate-500 text-xs shrink-0">{timeAgo(material.uploadedAt)}</span>
    </div>
  );
}

export default function UploadedMaterials({ materials }) {
  const hasMaterials = materials && materials.length > 0;
  const visible = hasMaterials ? materials.slice(0, 5) : [];

  if (!hasMaterials) return <EmptyState />;

  return (
    <div className="space-y-3">
      {visible.map((material) => (
        <MaterialCard key={material._id} material={material} />
      ))}

      {materials.length > 5 && (
        <div className="flex justify-center pt-1">
          <button className="text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg px-4 py-2 transition-colors">
            View all materials
          </button>
        </div>
      )}
    </div>
  );
}
