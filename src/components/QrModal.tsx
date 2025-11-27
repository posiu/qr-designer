import React from "react";
import type { QrSettings, GalleryItem } from "./SettingsPanel";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: GalleryItem | null;
  onEdit: (settings: QrSettings) => void;
  onDownload: (dataUrl: string, filename: string) => void;
};

export const QrModal: React.FC<Props> = ({
  isOpen,
  onClose,
  item,
  onEdit,
  onDownload,
}) => {
  if (!isOpen || !item) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    const filename = `qr-code-${new Date(item.timestamp).toISOString().slice(0, 10)}.png`;
    onDownload(item.thumbnail, filename);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getQrTypeLabel = (settings: QrSettings) => {
    switch (settings.dataType) {
      case "url": return "URL";
      case "text": return "Text";
      case "wifi": return "Wi-Fi";
      default: return "Unknown";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <h2 className="text-lg font-semibold">QR Code Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* QR Code Display */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <img
                src={item.thumbnail}
                alt="QR Code"
                className="max-w-full h-auto"
                style={{ 
                  width: `${item.settings.size}px`,
                  height: `${item.settings.size}px`,
                  imageRendering: 'pixelated'
                }}
              />
            </div>
          </div>

          {/* QR Info */}
          <div className="space-y-3 mb-6">
            <div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Type:</span>
              <span className="ml-2">{getQrTypeLabel(item.settings)}</span>
            </div>
            
            <div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Content:</span>
              <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm font-mono break-all">
                {item.qrText}
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Size:</span>
              <span className="ml-2">{item.settings.size}×{item.settings.size}px</span>
            </div>
            
            <div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Created:</span>
              <span className="ml-2">{formatDate(item.timestamp)}</span>
            </div>
            
            {item.settings.useAdvancedStyling && (
              <div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Style:</span>
                <span className="ml-2">
                  {item.settings.dotType}
                  {item.settings.useGradient && ` • ${item.settings.gradientType} gradient`}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onEdit(item.settings)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Settings
            </button>
            
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PNG
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
