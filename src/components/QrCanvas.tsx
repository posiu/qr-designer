import React, { useEffect, useRef } from "react";
import {
  generateRoundedDataUrl,
} from "../lib/generateQr";

type SymbolPosition = "none" | "center" | "tl" | "tr" | "bl" | "br";

type Props = {
  qrDataUrl: string | null;
  // optional: raw text to render with rounded dots (alternative to qrDataUrl)
  qrText?: string;
  size: number;
  symbolDataUrl?: string;
  symbolPosition: SymbolPosition;
  roundedDots?: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
};

export const QrCanvas: React.FC<Props> = ({
  qrDataUrl,
  qrText,
  size,
  symbolDataUrl,
  symbolPosition,
  roundedDots,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFromDataUrl = (dataUrl: string | null) => {
      if (!dataUrl) return;
      const qrImg = new Image();
      qrImg.src = dataUrl;

      qrImg.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);
      
      // ⬇️ NEW: clip to rounded outer border
      const outerRadius = size * 0.12; // adjust if you want more/less rounding
      ctx.save();
      ctx.beginPath();
      const r = outerRadius;
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();

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
          ctx.restore(); // restore from the outer clip
        };
      }
      };
  };

    const render = async () => {
      if (roundedDots && qrText) {
        // generate rounded-dot PNG data url and draw that instead of existing svg/png
        const dataUrl = await generateRoundedDataUrl(qrText, size);
        drawFromDataUrl(dataUrl);
      } else if (qrDataUrl) {
        drawFromDataUrl(qrDataUrl);
      }
    };

    render();
    onCanvasReady?.(canvas);
  }, [qrDataUrl, size, symbolDataUrl, symbolPosition, roundedDots, qrText, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-slate-200 rounded-xl shadow-sm bg-white"
    />
  );
};
