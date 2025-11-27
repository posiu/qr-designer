import React, { useRef, useEffect, useState, useCallback } from "react";

export interface LogoPosition {
  x: number; // 0-1 relative position
  y: number; // 0-1 relative position
  size: number; // 0-1 relative size
}

interface Props {
  qrDataUrl: string | null;
  size: number;
  symbolDataUrl?: string;
  logoPosition: LogoPosition;
  onLogoPositionChange: (position: LogoPosition) => void;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
  isDragMode: boolean;
}

export const DragDropCanvas: React.FC<Props> = ({
  qrDataUrl,
  size,
  symbolDataUrl,
  logoPosition,
  onLogoPositionChange,
  onCanvasReady,
  isDragMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const drawQrWithLogo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !qrDataUrl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    // Draw QR code
    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    qrImg.onload = () => {
      // Apply rounded corners clipping
      const outerRadius = size * 0.12;
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

      // Draw logo if present
      if (symbolDataUrl) {
        const logoImg = new Image();
        logoImg.src = symbolDataUrl;
        logoImg.onload = () => {
          const logoSize = size * logoPosition.size;
          const x = (size - logoSize) * logoPosition.x;
          const y = (size - logoSize) * logoPosition.y;

          // Draw white rounded background
          const radius = logoSize * 0.25;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + logoSize - radius, y);
          ctx.quadraticCurveTo(x + logoSize, y, x + logoSize, y + radius);
          ctx.lineTo(x + logoSize, y + logoSize - radius);
          ctx.quadraticCurveTo(x + logoSize, y + logoSize, x + logoSize - radius, y + logoSize);
          ctx.lineTo(x + radius, y + logoSize);
          ctx.quadraticCurveTo(x, y + logoSize, x, y + logoSize - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fillStyle = "white";
          ctx.fill();

          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          ctx.restore();

          // Draw drag handles if in drag mode
          if (isDragMode) {
            drawDragHandles(ctx, x, y, logoSize);
          }
        };
      }

      ctx.restore();
    };
  }, [qrDataUrl, size, symbolDataUrl, logoPosition, isDragMode]);

  const drawDragHandles = (ctx: CanvasRenderingContext2D, x: number, y: number, logoSize: number) => {
    ctx.save();
    
    // Draw selection border
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x - 2, y - 2, logoSize + 4, logoSize + 4);
    
    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = "#3b82f6";
    ctx.setLineDash([]);
    
    // Top-left
    ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
    // Top-right
    ctx.fillRect(x + logoSize - handleSize/2, y - handleSize/2, handleSize, handleSize);
    // Bottom-left
    ctx.fillRect(x - handleSize/2, y + logoSize - handleSize/2, handleSize, handleSize);
    // Bottom-right
    ctx.fillRect(x + logoSize - handleSize/2, y + logoSize - handleSize/2, handleSize, handleSize);
    
    ctx.restore();
  };

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const isInLogoArea = (mouseX: number, mouseY: number) => {
    if (!symbolDataUrl) return false;
    
    const logoSize = size * logoPosition.size;
    const x = (size - logoSize) * logoPosition.x;
    const y = (size - logoSize) * logoPosition.y;
    
    return mouseX >= x && mouseX <= x + logoSize && mouseY >= y && mouseY <= y + logoSize;
  };

  const isInResizeHandle = (mouseX: number, mouseY: number) => {
    if (!symbolDataUrl) return false;
    
    const logoSize = size * logoPosition.size;
    const x = (size - logoSize) * logoPosition.x;
    const y = (size - logoSize) * logoPosition.y;
    const handleSize = 8;
    
    // Check bottom-right corner handle
    return mouseX >= x + logoSize - handleSize && mouseX <= x + logoSize + handleSize &&
           mouseY >= y + logoSize - handleSize && mouseY <= y + logoSize + handleSize;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDragMode || !symbolDataUrl) return;

    const coords = getCanvasCoordinates(e);
    
    if (isInResizeHandle(coords.x, coords.y)) {
      setIsResizing(true);
      setDragStart(coords);
    } else if (isInLogoArea(coords.x, coords.y)) {
      setIsDragging(true);
      setDragStart(coords);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragMode || !symbolDataUrl) return;

    const coords = getCanvasCoordinates(e);
    
    // Change cursor based on hover area
    const canvas = canvasRef.current;
    if (canvas) {
      if (isInResizeHandle(coords.x, coords.y)) {
        canvas.style.cursor = 'nw-resize';
      } else if (isInLogoArea(coords.x, coords.y)) {
        canvas.style.cursor = 'move';
      } else {
        canvas.style.cursor = isDragMode ? 'crosshair' : 'default';
      }
    }

    if (isDragging) {
      const deltaX = coords.x - dragStart.x;
      const deltaY = coords.y - dragStart.y;
      
      const logoSize = size * logoPosition.size;
      const currentX = (size - logoSize) * logoPosition.x;
      const currentY = (size - logoSize) * logoPosition.y;
      
      const newX = Math.max(0, Math.min(size - logoSize, currentX + deltaX));
      const newY = Math.max(0, Math.min(size - logoSize, currentY + deltaY));
      
      onLogoPositionChange({
        ...logoPosition,
        x: newX / (size - logoSize),
        y: newY / (size - logoSize),
      });
      
      setDragStart(coords);
    } else if (isResizing) {
      const logoSize = size * logoPosition.size;
      const x = (size - logoSize) * logoPosition.x;
      // const y = (size - logoSize) * logoPosition.y; // Unused in resize handle check
      
      const newSize = Math.max(0.1, Math.min(0.5, (coords.x - x) / size));
      
      onLogoPositionChange({
        ...logoPosition,
        size: newSize,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    drawQrWithLogo();
    onCanvasReady?.(canvasRef.current);
  }, [drawQrWithLogo, onCanvasReady]);

  return (
    <div 
      ref={containerRef}
      className="relative inline-block"
    >
      <canvas
        ref={canvasRef}
        className={`border border-slate-200 rounded-xl shadow-sm bg-white ${
          isDragMode ? 'cursor-crosshair' : ''
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {isDragMode && symbolDataUrl && (
        <div className="absolute -top-8 left-0 text-xs text-blue-600 font-medium">
          Drag mode: Click and drag logo to reposition
        </div>
      )}
    </div>
  );
};
