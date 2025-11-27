import React, { useState, useEffect } from "react";
import type { QrSettings, GalleryItem } from "./SettingsPanel";
import { QrModal } from "./QrModal";

type Props = {
  onRestoreSettings: (settings: QrSettings) => void;
  currentSettings?: QrSettings;
  currentThumbnail?: string;
  currentQrText?: string;
};

const STORAGE_KEY = "qr-designer-gallery";
const MAX_ITEMS = 50;

export const GalleryPanel: React.FC<Props> = ({
  onRestoreSettings,
  currentSettings,
  currentThumbnail,
  currentQrText,
}) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load gallery from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: GalleryItem[] = JSON.parse(stored);
        setGalleryItems(items.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error("Failed to load gallery:", error);
    }
  }, []);

  // Save gallery to localStorage
  const saveGallery = (items: GalleryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      setGalleryItems(items);
    } catch (error) {
      console.error("Failed to save gallery:", error);
    }
  };

  // Add current QR to gallery
  const addToGallery = () => {
    if (!currentSettings || !currentThumbnail || !currentQrText) return;

    const newItem: GalleryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      settings: { ...currentSettings },
      thumbnail: currentThumbnail,
      qrText: currentQrText,
    };

    const updatedItems = [newItem, ...galleryItems].slice(0, MAX_ITEMS);
    saveGallery(updatedItems);
  };

  // Remove item from gallery
  const removeItem = (id: string) => {
    const updatedItems = galleryItems.filter(item => item.id !== id);
    saveGallery(updatedItems);
  };

  // Clear entire gallery
  const clearGallery = () => {
    if (confirm("Are you sure you want to clear the entire gallery?")) {
      saveGallery([]);
    }
  };

  // Handle modal functions
  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleEditItem = (settings: QrSettings) => {
    onRestoreSettings(settings);
    handleCloseModal();
  };

  const handleDownloadItem = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getQrTypeLabel = (settings: QrSettings) => {
    switch (settings.dataType) {
      case "url": return "URL";
      case "text": return "Text";
      case "wifi": return "Wi-Fi";
      default: return "QR";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">
          Gallery ({galleryItems.length}/{MAX_ITEMS})
        </h2>
        <div className="flex gap-2">
          {currentSettings && currentThumbnail && (
            <button
              type="button"
              onClick={addToGallery}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100"
            >
              Save
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      {galleryItems.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">
          No saved QR codes yet. Generate and save your first QR code!
        </p>
      ) : (
        <>
          <div className={`grid gap-2 transition-all duration-200 ${
            isExpanded 
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-h-96 overflow-y-auto" 
              : "grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 max-h-20 overflow-hidden"
          }`}>
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-50 rounded-lg p-2 hover:bg-slate-100 cursor-pointer border border-slate-200"
                onClick={() => handleItemClick(item)}
              >
                <img
                  src={item.thumbnail}
                  alt="QR thumbnail"
                  className="w-full aspect-square object-contain rounded"
                />
                
                {isExpanded && (
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {getQrTypeLabel(item.settings)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {galleryItems.length > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearGallery}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <QrModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        onEdit={handleEditItem}
        onDownload={handleDownloadItem}
      />
    </div>
  );
};
