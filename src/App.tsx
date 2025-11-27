import React, { useState, useCallback, useEffect } from "react";
import { generateQrDataUrl, generateQrSvg } from "./lib/generateQr";
import { AdvancedQrGenerator, type AdvancedQrOptions } from "./lib/advancedQrGenerator";
import { SettingsPanel, type QrSettings, type Theme } from "./components/SettingsPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { ExportPanel } from "./components/ExportPanel";
import { GalleryPanel } from "./components/GalleryPanel";
import { ThemeToggle } from "./components/ThemeToggle";
import { NotificationContainer } from "./components/NotificationContainer";
import { useNotifications } from "./contexts/NotificationContext";

function App() {
  const { success, error } = useNotifications();
  
  // Debug: Log initial state
  useEffect(() => {
    console.log('=== APP COMPONENT MOUNTED ===');
    console.log('Initial document classes:', document.documentElement.className);
    console.log('Initial data-theme:', document.documentElement.getAttribute('data-theme'));
    console.log('System prefers dark:', window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);
  const [settings, setSettings] = useState<QrSettings>({
    dataType: "url",
    url: "",
    text: "",
    wifiSsid: "",
    wifiPassword: "",
    wifiSecurity: "WPA",
    wifiHidden: false,
    fg: "#0f172a", // slate-900
    bg: "#ffffff",
    size: 512,
    ecLevel: "H",
    symbolPos: "center",
    symbolDataUrl: undefined,
    
    // Advanced styling defaults
    useAdvancedStyling: false,
    dotType: "square",
    useGradient: false,
    gradientType: "linear",
    gradientRotation: 0,
    gradientStartColor: "#0f172a",
    gradientEndColor: "#64748b",
    cornerSquareType: "square",
    cornerDotType: "square",
    cornerSquareColor: "#0f172a",
    cornerDotColor: "#0f172a",
    
    // Logo positioning
    logoPosition: { x: 0.5, y: 0.5, size: 0.2 },
    isDragMode: false,
  });
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const normalizeUrl = (inputUrl: string): string => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return trimmed;
    
    // If it already has a protocol, return as is
    if (trimmed.match(/^https?:\/\//i)) {
      return trimmed;
    }
    
    // Add https:// if it looks like a domain
    if (trimmed.includes('.') && !trimmed.includes(' ')) {
      return `https://${trimmed}`;
    }
    
    return trimmed;
  };

  const getQrText = (): string => {
    switch (settings.dataType) {
      case "url":
        return normalizeUrl(settings.url);
      case "text":
        return settings.text;
      case "wifi":
        // WiFi QR format: WIFI:T:WPA;S:mynetwork;P:mypass;H:false;;
        const security = settings.wifiSecurity === "nopass" ? "" : settings.wifiSecurity;
        const password = settings.wifiSecurity === "nopass" ? "" : settings.wifiPassword;
        const hidden = settings.wifiHidden ? "true" : "false";
        return `WIFI:T:${security};S:${settings.wifiSsid};P:${password};H:${hidden};;`;
      default:
        return "";
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const qrText = getQrText();
    if (!qrText) return;

    try {
      setIsGenerating(true);
      
      if (settings.useAdvancedStyling) {
        // Use advanced generator
        const advancedOptions: AdvancedQrOptions = {
          text: qrText,
          width: settings.size,
          errorCorrectionLevel: settings.ecLevel,
          dotsType: settings.dotType,
          
          // Handle gradient or solid color for dots
          ...(settings.useGradient ? {
            dotsGradient: {
              type: settings.gradientType,
              rotation: settings.gradientRotation,
              colorStops: [
                { offset: 0, color: settings.gradientStartColor },
                { offset: 1, color: settings.gradientEndColor }
              ]
            }
          } : {
            dotsColor: settings.fg
          }),
          
          backgroundColor: settings.bg,
          cornerSquareColor: settings.cornerSquareColor,
          cornerSquareType: settings.cornerSquareType,
          cornerDotColor: settings.cornerDotColor,
          cornerDotType: settings.cornerDotType,
          
          // Logo options
          ...(settings.symbolDataUrl ? {
            image: settings.symbolDataUrl,
            imageSize: 0.3,
            imageMargin: 5,
            hideBackgroundDots: true,
          } : {})
        };
        
        const generator = new AdvancedQrGenerator(advancedOptions);
        const dataUrl = await generator.getPngDataUrl();
        setQrDataUrl(dataUrl);
      } else {
        // Use simple generator
      const dataUrl = await generateQrDataUrl({
          text: qrText,
          width: settings.size,
          colorDark: settings.fg,
          colorLight: settings.bg,
          errorCorrectionLevel: settings.ecLevel,
      });
      setQrDataUrl(dataUrl);
      }
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
        setSettings(prev => ({ ...prev, symbolDataUrl: reader.result as string }));
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

  const handleDownloadSvg = useCallback(async () => {
    const qrText = getQrText();
    if (!qrText) return;

    try {
      if (settings.useAdvancedStyling) {
        // Use advanced generator for SVG
        const advancedOptions: AdvancedQrOptions = {
          text: qrText,
          width: settings.size,
          errorCorrectionLevel: settings.ecLevel,
          dotsType: settings.dotType,
          
          ...(settings.useGradient ? {
            dotsGradient: {
              type: settings.gradientType,
              rotation: settings.gradientRotation,
              colorStops: [
                { offset: 0, color: settings.gradientStartColor },
                { offset: 1, color: settings.gradientEndColor }
              ]
            }
          } : {
            dotsColor: settings.fg
          }),
          
          backgroundColor: settings.bg,
          cornerSquareColor: settings.cornerSquareColor,
          cornerSquareType: settings.cornerSquareType,
          cornerDotColor: settings.cornerDotColor,
          cornerDotType: settings.cornerDotType,
          
          ...(settings.symbolDataUrl ? {
            image: settings.symbolDataUrl,
            imageSize: 0.3,
            imageMargin: 5,
            hideBackgroundDots: true,
          } : {})
        };
        
        const generator = new AdvancedQrGenerator(advancedOptions);
        await generator.downloadSvg();
      } else {
        // Use simple generator for SVG
        const svgString = await generateQrSvg({
          text: qrText,
          width: settings.size,
          colorDark: settings.fg,
          colorLight: settings.bg,
          errorCorrectionLevel: settings.ecLevel,
        });
        
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "qr-code.svg";
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to generate SVG:", err);
      error("SVG Export Failed", "Could not generate SVG file. Please try again.");
    }
  }, [settings, getQrText]);

  const handleShare = useCallback(async () => {
    if (!canvasRef) return;

    try {
      // Convert canvas to blob
      canvasRef.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], "qr-code.png", { type: "image/png" });
        
        if (navigator.share) {
          await navigator.share({
            title: "QR Code",
            text: "Check out this QR code!",
            files: [file],
          });
        }
      }, "image/png");
    } catch (err) {
      console.error("Failed to share:", err);
      error("Share Failed", "Could not share QR code. Please try downloading instead.");
    }
  }, [canvasRef]);

  const handleCopyEmbed = async () => {
    if (!canvasRef) return;
    const embedCode = `<img src="${canvasRef.toDataURL(
      "image/png"
    )}" alt="QR code" width="${settings.size}" height="${settings.size}" />`;
    
    try {
      await navigator.clipboard.writeText(embedCode);
      success("Copied to clipboard!", "Embed code has been copied successfully.");
    } catch {
      error("Copy failed", "Could not copy embed code. Please check clipboard permissions.");
    }
  };

  const themes: Theme[] = [
  {
    id: "classic",
    label: "Classic",
    fg: "#0f172a",
    bg: "#ffffff",
  },
  {
    id: "midnight",
    label: "Midnight",
    fg: "#e5e7eb",
    bg: "#020617",
  },
  {
    id: "sunset",
    label: "Sunset",
    fg: "#be123c",
    bg: "#fef3c7",
  },
  {
    id: "aqua",
    label: "Aqua",
    fg: "#0e7490",
    bg: "#ecfeff",
  },
];

  return (
    <div 
      className="min-h-screen flex flex-col items-center p-6 transition-colors"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-5xl">
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <h1 
                className="text-2xl md:text-3xl font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                QR Designer
          </h1>
              <ThemeToggle />
            </div>
            <p 
            className="text-sm md:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            Create colorful QR codes with a logo and export as PNG or embed code.
          </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
          {/* Left: Settings */}
          <SettingsPanel
            settings={settings}
            onSettingsChange={(newSettings) => 
              setSettings(prev => ({ ...prev, ...newSettings }))
            }
            onSymbolUpload={handleSymbolUpload}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            themes={themes}
          />

          {/* Right: Preview & export */}
          <div className="space-y-4">
            <PreviewPanel
                  qrDataUrl={qrDataUrl}
              size={settings.size}
              symbolDataUrl={settings.symbolDataUrl}
              symbolPosition={settings.symbolPos}
              logoPosition={settings.logoPosition}
              isDragMode={settings.isDragMode}
                  onCanvasReady={setCanvasRef}
              onLogoPositionChange={(position) => 
                setSettings(prev => ({ ...prev, logoPosition: position }))
              }
            />

            <ExportPanel
              canvasRef={canvasRef}
              size={settings.size}
              onDownloadPng={handleDownloadPng}
              onDownloadSvg={handleDownloadSvg}
              onCopyEmbed={handleCopyEmbed}
              onShare={handleShare}
            />

            <GalleryPanel
              onRestoreSettings={(newSettings) => setSettings(newSettings)}
              currentSettings={qrDataUrl ? settings : undefined}
              currentThumbnail={canvasRef?.toDataURL("image/png")}
              currentQrText={qrDataUrl ? getQrText() : undefined}
            />
          </div>
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
}

export default App;
