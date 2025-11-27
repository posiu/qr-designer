import React, { useEffect, useRef } from "react";

type SymbolPosition = "none" | "center" | "tl" | "tr" | "bl" | "br";

type Props = {
  qrDataUrl: string | null;
  size: number;
  symbolDataUrl?: string;
  symbolPosition: SymbolPosition;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
};

export const QrCanvas: React.FC<Props> = ({
  qrDataUrl,
  size,
  symbolDataUrl,
  symbolPosition,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !qrDataUrl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const qrImg = new Image();
    qrImg.src = qrDataUrl;

    qrImg.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(qrImg, 0, 0, size, size);

      if (symbolDataUrl && symbolPosition !== "none") {
        const logoImg = new Image();
        logoImg.src = symbolDataUrl;

        logoImg.onload = () => {
          const logoSize = size * 0.2; // 20% of QR side
          let x = 0;
          let y = 0;

          switch (symbolPosition) {
            case "center":
              x = (size - logoSize) / 2;
              y = (size - logoSize) / 2;
              break;
            case "tl":
              x = size * 0.05;
              y = size * 0.05;
              break;
            case "tr":
              x = size - logoSize - size * 0.05;
              y = size * 0.05;
              break;
            case "bl":
              x = size * 0.05;
              y = size - logoSize - size * 0.05;
              break;
            case "br":
              x = size - logoSize - size * 0.05;
              y = size - logoSize - size * 0.05;
              break;
            case "none":
            default:
              return;
          }

          // Draw white rounded background so logo is readable
          const radius = logoSize * 0.25;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + logoSize - radius, y);
          ctx.quadraticCurveTo(
            x + logoSize,
            y,
            x + logoSize,
            y + radius
          );
          ctx.lineTo(x + logoSize, y + logoSize - radius);
          ctx.quadraticCurveTo(
            x + logoSize,
            y + logoSize,
            x + logoSize - radius,
            y + logoSize
          );
          ctx.lineTo(x + radius, y + logoSize);
          ctx.quadraticCurveTo(x, y + logoSize, x, y + logoSize - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fillStyle = "white";
          ctx.fill();

          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          ctx.restore();
        };
      }
    };

    onCanvasReady?.(canvas);
  }, [qrDataUrl, size, symbolDataUrl, symbolPosition, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-slate-200 rounded-xl shadow-sm bg-white"
    />
  );
};
