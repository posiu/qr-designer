import React, { useState, useCallback } from "react";
import { generateQrDataUrl } from "./lib/generateQr";
import { QrCanvas } from "./components/QrCanvas";

type ErrorCorrection = "L" | "M" | "Q" | "H";
type SymbolPosition = "none" | "center" | "tl" | "tr" | "bl" | "br";

function App() {
  const [url, setUrl] = useState("");
  const [fg, setFg] = useState("#0f172a"); // slate-900
  const [bg, setBg] = useState("#ffffff");
  const [size, setSize] = useState(512);
  const [ecLevel, setEcLevel] = useState<ErrorCorrection>("H");
  const [symbolPos, setSymbolPos] = useState<SymbolPosition>("center");
  const [symbolDataUrl, setSymbolDataUrl] = useState<string | undefined>();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setIsGenerating(true);
      const dataUrl = await generateQrDataUrl({
        text: url,
        width: size,
        colorDark: fg,
        colorLight: bg,
        errorCorrectionLevel: ecLevel,
      });
      setQrDataUrl(dataUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSymbolUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSymbolDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPng = useCallback(() => {
    if (!canvasRef) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvasRef.toDataURL("image/png");
    link.click();
  }, [canvasRef]);

  const embedCode = canvasRef
    ? `<img src="${canvasRef.toDataURL(
        "image/png"
      )}" alt="QR code" width="${size}" height="${size}" />`
    : "";

  const handleCopyEmbed = async () => {
    if (!embedCode) return;
    try {
      await navigator.clipboard.writeText(embedCode);
      alert("Embed code copied to clipboard!");
    } catch {
      alert("Could not copy embed code (clipboard permission issue).");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl">
        <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            QR Designer
          </h1>
          <p className="text-slate-500 text-sm">
            Create colorful QR codes with a logo and export as PNG or embed code.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
          {/* Left: Form */}
          <form
            onSubmit={handleGenerate}
            className="bg-white shadow-sm rounded-2xl border border-slate-200 p-5 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Target URL
              </label>
              <input
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                type="url"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-400">
                Make sure it&apos;s a valid URL. The QR will encode this value.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Foreground color
                </label>
                <input
                  type="color"
                  className="mt-1 w-full h-10 border border-slate-200 rounded-lg cursor-pointer bg-white"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Background color
                </label>
                <input
                  type="color"
                  className="mt-1 w-full h-10 border border-slate-200 rounded-lg cursor-pointer bg-white"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Size ({size}px)
                </label>
                <input
                  type="range"
                  min={256}
                  max={1024}
                  step={64}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="mt-1 w-full"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Larger sizes look sharper when printed.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Error correction
                </label>
                <select
                  className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  value={ecLevel}
                  onChange={(e) =>
                    setEcLevel(e.target.value as ErrorCorrection)
                  }
                >
                  <option value="L">L — lowest (more data capacity)</option>
                  <option value="M">M — medium</option>
                  <option value="Q">Q — high</option>
                  <option value="H">
                    H — highest (best for QR with logos)
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Symbol / logo image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSymbolUpload}
                  className="mt-1 block w-full text-sm text-slate-600
                             file:mr-2 file:py-1.5 file:px-3
                             file:rounded-md file:border-0
                             file:text-sm file:font-medium
                             file:bg-slate-900 file:text-white
                             hover:file:bg-slate-800"
                />
                <p className="mt-1 text-xs text-slate-400">
                  PNG/SVG/JPG. Transparent logos work best.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Symbol position
                </label>
                <select
                  className="mt-1 w-full border border-slate-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  value={symbolPos}
                  onChange={(e) =>
                    setSymbolPos(e.target.value as SymbolPosition)
                  }
                >
                  <option value="none">None</option>
                  <option value="center">Center</option>
                  <option value="tl">Top-left</option>
                  <option value="tr">Top-right</option>
                  <option value="bl">Bottom-left</option>
                  <option value="br">Bottom-right</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium shadow-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-wait"
            >
              {isGenerating ? "Generating..." : "Generate QR code"}
            </button>
          </form>

          {/* Right: Preview & export */}
          <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-2xl border border-slate-200 p-4 flex flex-col items-center justify-center min-h-[320px]">
              {qrDataUrl ? (
                <QrCanvas
                  qrDataUrl={qrDataUrl}
                  size={size}
                  symbolDataUrl={symbolDataUrl}
                  symbolPosition={symbolPos}
                  onCanvasReady={setCanvasRef}
                />
              ) : (
                <p className="text-sm text-slate-400 text-center">
                  Fill in the form and click &quot;Generate QR code&quot; to
                  see the preview here.
                </p>
              )}
            </div>

            <div className="bg-white shadow-sm rounded-2xl border border-slate-200 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-800">
                Export
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={!canvasRef}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download PNG
                </button>
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  disabled={!canvasRef}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy embed code
                </button>
              </div>
              <textarea
                className="mt-2 w-full border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-700 resize-none"
                rows={4}
                readOnly
                value={embedCode}
                placeholder="<img src='...' alt='QR code' />"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
