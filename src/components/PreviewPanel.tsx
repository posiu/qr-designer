import React from "react";
import { QrCanvas } from "./QrCanvas";
import { DragDropCanvas, type LogoPosition } from "./DragDropCanvas";
import type { SymbolPosition } from "./SettingsPanel";

type Props = {
  qrDataUrl: string | null;
  size: number;
  symbolDataUrl?: string;
  symbolPosition: SymbolPosition;
  logoPosition: LogoPosition;
  isDragMode: boolean;
  onCanvasReady: (canvas: HTMLCanvasElement | null) => void;
  onLogoPositionChange: (position: LogoPosition) => void;
};

export const PreviewPanel: React.FC<Props> = ({
  qrDataUrl,
  size,
  symbolDataUrl,
  symbolPosition,
  logoPosition,
  isDragMode,
  onCanvasReady,
  onLogoPositionChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col items-center justify-center min-h-[320px]">
      {qrDataUrl ? (
        symbolPosition === "custom" ? (
          <DragDropCanvas
            qrDataUrl={qrDataUrl}
            size={size}
            symbolDataUrl={symbolDataUrl}
            logoPosition={logoPosition}
            onLogoPositionChange={onLogoPositionChange}
            onCanvasReady={onCanvasReady}
            isDragMode={isDragMode}
          />
        ) : (
          <QrCanvas
            qrDataUrl={qrDataUrl}
            size={size}
            symbolDataUrl={symbolDataUrl}
            symbolPosition={symbolPosition}
            onCanvasReady={onCanvasReady}
          />
        )
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center">
          Fill in the form and click &quot;Generate QR code&quot; to see the
          preview here.
        </p>
      )}
    </div>
  );
};
