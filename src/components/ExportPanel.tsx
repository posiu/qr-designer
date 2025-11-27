import React from "react";

type Props = {
  canvasRef: HTMLCanvasElement | null;
  size: number;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
  onCopyEmbed: () => void;
  onShare?: () => void;
};

export const ExportPanel: React.FC<Props> = ({
  canvasRef,
  size,
  onDownloadPng,
  onDownloadSvg,
  onCopyEmbed,
  onShare,
}) => {
  // Check if Web Share API is supported
  const canShare = typeof navigator !== "undefined" && "share" in navigator;
  const embedCode = canvasRef
    ? `<img src="${canvasRef.toDataURL(
        "image/png"
      )}" alt="QR code" width="${size}" height="${size}" />`
    : "";

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Export</h2>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onDownloadPng}
          disabled={!canvasRef}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download PNG
        </button>
        <button
          type="button"
          onClick={onDownloadSvg}
          disabled={!canvasRef}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download SVG
        </button>
        <button
          type="button"
          onClick={onCopyEmbed}
          disabled={!canvasRef}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Copy embed code
        </button>
        {canShare && onShare && (
          <button
            type="button"
            onClick={onShare}
            disabled={!canvasRef}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Share
          </button>
        )}
      </div>
      <textarea
        className="mt-2 w-full border rounded-lg p-2 text-xs font-mono resize-none"
        rows={4}
        readOnly
        value={embedCode}
        placeholder="<img src='...' alt='QR code' />"
      />
    </div>
  );
};
