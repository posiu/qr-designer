import React from "react";
import { useNotifications } from "../contexts/NotificationContext";

export type ErrorCorrection = "L" | "M" | "Q" | "H";
export type SymbolPosition = "none" | "center" | "tl" | "tr" | "bl" | "br" | "custom";

export interface LogoPosition {
  x: number; // 0-1 relative position
  y: number; // 0-1 relative position
  size: number; // 0-1 relative size
}

export type QrDataType = "url" | "text" | "wifi";

export type GalleryItem = {
  id: string;
  timestamp: number;
  settings: QrSettings;
  thumbnail: string; // base64 data URL
  qrText: string;
};

export type QrSettings = {
  dataType: QrDataType;
  url: string;
  text: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiSecurity: "WPA" | "WEP" | "nopass";
  wifiHidden: boolean;
  fg: string;
  bg: string;
  size: number;
  ecLevel: ErrorCorrection;
  symbolPos: SymbolPosition;
  symbolDataUrl?: string;
  logoPosition: LogoPosition;
  isDragMode: boolean;
  
  // Advanced styling options
  useAdvancedStyling: boolean;
  dotType: "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
  useGradient: boolean;
  gradientType: "linear" | "radial";
  gradientRotation: number;
  gradientStartColor: string;
  gradientEndColor: string;
  cornerSquareType: "square" | "dot" | "extra-rounded";
  cornerDotType: "square" | "dot";
  cornerSquareColor: string;
  cornerDotColor: string;
};

export type Theme = {
  id: string;
  label: string;
  fg: string;
  bg: string;
};

type Props = {
  settings: QrSettings;
  onSettingsChange: (settings: Partial<QrSettings>) => void;
  onSymbolUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: (e: React.FormEvent) => void;
  isGenerating: boolean;
  themes: Theme[];
};

export const SettingsPanel: React.FC<Props> = ({
  settings,
  onSettingsChange,
  onSymbolUpload,
  onGenerate,
  isGenerating,
  themes,
}) => {
  const { warning } = useNotifications();
  const { 
    dataType, url, text, wifiSsid, wifiPassword, wifiSecurity, wifiHidden, 
    fg, bg, size, ecLevel, symbolPos, useAdvancedStyling, dotType, 
    useGradient, gradientType, gradientRotation, gradientStartColor, gradientEndColor,
    cornerSquareType, cornerDotType, cornerSquareColor, cornerDotColor, logoPosition, isDragMode
  } = settings;

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

  const validateInput = (type: string, value: string): boolean => {
    switch (type) {
      case 'url':
        if (!value.trim()) {
          warning("URL Required", "Please enter a valid URL to generate QR code.");
          return false;
        }
        try {
          const normalizedUrl = normalizeUrl(value);
          new URL(normalizedUrl);
          return true;
        } catch {
          warning("Invalid URL", "Please enter a valid URL (e.g., https://example.com).");
          return false;
        }
      
      case 'text':
        if (!value.trim()) {
          warning("Text Required", "Please enter some text to generate QR code.");
          return false;
        }
        if (value.length > 2000) {
          warning("Text Too Long", "Text should be less than 2000 characters for optimal QR code generation.");
          return false;
        }
        return true;
      
      case 'wifi':
        if (!wifiSsid.trim()) {
          warning("WiFi SSID Required", "Please enter the network name (SSID).");
          return false;
        }
        if (wifiSecurity !== 'nopass' && !wifiPassword.trim()) {
          warning("WiFi Password Required", "Please enter the network password.");
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let inputValue = '';
    switch (dataType) {
      case 'url':
        inputValue = url;
        break;
      case 'text':
        inputValue = text;
        break;
      case 'wifi':
        inputValue = wifiSsid; // We'll validate both SSID and password
        break;
    }
    
    if (validateInput(dataType, inputValue)) {
      onGenerate(e);
    }
  };

  const renderDataInput = () => {
    switch (dataType) {
      case "url":
        return (
          <div>
            <label className="block text-sm font-medium ">
              Target URL
            </label>
              <input
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                type="url"
                required
                placeholder="example.com or https://example.com"
                value={url}
                onChange={(e) => onSettingsChange({ url: e.target.value })}
                onBlur={(e) => {
                  const normalized = normalizeUrl(e.target.value);
                  if (normalized !== e.target.value) {
                    onSettingsChange({ url: normalized });
                  }
                }}
              />
            <p className="mt-1 text-xs text-slate-400">
              Make sure it&apos;s a valid URL. The QR will encode this value.
            </p>
          </div>
        );
      
      case "text":
        return (
          <div>
            <label className="block text-sm font-medium ">
              Text Content
            </label>
            <textarea
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
              placeholder="Enter any text content..."
              rows={3}
              value={text}
              onChange={(e) => onSettingsChange({ text: e.target.value })}
            />
            <p className="mt-1 text-xs text-slate-400">
              Any text content will be encoded in the QR code.
            </p>
          </div>
        );
      
      case "wifi":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Network Name (SSID)
                </label>
                <input
                  className="mt-1 w-full border border rounded-lg px-3 py-2 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  type="text"
                  required
                  placeholder="MyWiFi"
                  value={wifiSsid}
                  onChange={(e) => onSettingsChange({ wifiSsid: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Security Type
                </label>
                <select
                  className="mt-1 w-full border border rounded-lg px-2 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={wifiSecurity}
                  onChange={(e) => onSettingsChange({ wifiSecurity: e.target.value as "WPA" | "WEP" | "nopass" })}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open (No Password)</option>
                </select>
              </div>
            </div>
            
            {wifiSecurity !== "nopass" && (
              <div>
                <label className="block text-sm font-medium ">
                  Password
                </label>
                <input
                  className="mt-1 w-full border border rounded-lg px-3 py-2 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  type="password"
                  required
                  placeholder="WiFi password"
                  value={wifiPassword}
                  onChange={(e) => onSettingsChange({ wifiPassword: e.target.value })}
                />
              </div>
            )}
            
            <div className="flex items-center">
              <input
                id="wifi-hidden"
                type="checkbox"
                className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded"
                checked={wifiHidden}
                onChange={(e) => onSettingsChange({ wifiHidden: e.target.checked })}
              />
              <label htmlFor="wifi-hidden" className="ml-2 block text-sm ">
                Hidden network
              </label>
            </div>
            
            <p className="text-xs text-slate-400">
              Scanning this QR will automatically connect to your WiFi network.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shadow-sm rounded-2xl p-5 space-y-5"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
        <div>
          <label className="block text-sm font-medium mb-2">
            QR Code Type
          </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSettingsChange({ dataType: "url" })}
            data-primary={dataType === "url"}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => onSettingsChange({ dataType: "text" })}
            data-primary={dataType === "text"}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => onSettingsChange({ dataType: "wifi" })}
            data-primary={dataType === "wifi"}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border"
          >
            Wi-Fi
          </button>
        </div>
      </div>

      {renderDataInput()}

      <div>
        <span className="block text-sm font-medium  mb-1">
          Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => {
            const isActive = fg.toLowerCase() === t.fg.toLowerCase() && bg.toLowerCase() === t.bg.toLowerCase();
            
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSettingsChange({ fg: t.fg, bg: t.bg })}
                className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                  isActive 
                    ? 'border-2 border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-105' 
                    : 'border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        
        {/* Gradient Presets */}
        <div className="mt-2">
          <span className="block text-xs font-medium  mb-1">
            Gradient Presets
          </span>
          <div className="flex flex-wrap gap-1">
            {[
              { name: "Sunset", start: "#ff7e5f", end: "#feb47b" },
              { name: "Ocean", start: "#667eea", end: "#764ba2" },
              { name: "Neon", start: "#00f5ff", end: "#fc00ff" },
              { name: "Forest", start: "#134e5e", end: "#71b280" },
              { name: "Fire", start: "#ff9a9e", end: "#fecfef" },
            ].map((preset) => {
              const isActive = useGradient && 
                gradientStartColor.toLowerCase() === preset.start.toLowerCase() && 
                gradientEndColor.toLowerCase() === preset.end.toLowerCase();
              
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onSettingsChange({ 
                    useAdvancedStyling: true,
                    useGradient: true,
                    gradientStartColor: preset.start,
                    gradientEndColor: preset.end,
                    gradientType: "linear",
                    gradientRotation: 45
                  })}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    isActive 
                      ? 'border-2 border-white shadow-lg transform scale-105' 
                      : 'border border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    background: `linear-gradient(45deg, ${preset.start}, ${preset.end})`,
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium ">
            Foreground color
          </label>
          <input
            type="color"
            className="mt-1 w-full h-10 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer bg-white dark:bg-slate-700"
            value={fg}
            onChange={(e) => onSettingsChange({ fg: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">
            Background color
          </label>
          <input
            type="color"
            className="mt-1 w-full h-10 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer bg-white dark:bg-slate-700"
            value={bg}
            onChange={(e) => onSettingsChange({ bg: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium ">
            Size ({size}px)
          </label>
          <input
            type="range"
            min={256}
            max={1024}
            step={64}
            value={size}
            onChange={(e) => onSettingsChange({ size: Number(e.target.value) })}
            className="mt-1 w-full"
          />
          <p className="mt-1 text-xs text-slate-400">
            Larger sizes look sharper when printed.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium ">
            Error correction
          </label>
          <select
            className="mt-1 w-full border border rounded-lg px-2 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={ecLevel}
            onChange={(e) =>
              onSettingsChange({ ecLevel: e.target.value as ErrorCorrection })
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
          <label className="block text-sm font-medium ">
            Symbol / logo image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onSymbolUpload}
            className="mt-1 block w-full text-sm                        file:mr-2 file:py-1.5 file:px-3
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
                <label className="block text-sm font-medium ">
                  Symbol position
                </label>
          <select
            className="mt-1 w-full border border rounded-lg px-2 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={symbolPos}
            onChange={(e) =>
              onSettingsChange({ symbolPos: e.target.value as SymbolPosition })
            }
          >
                  <option value="none">None</option>
                  <option value="center">Center</option>
                  <option value="tl">Top-left</option>
                  <option value="tr">Top-right</option>
                  <option value="bl">Bottom-left</option>
                  <option value="br">Bottom-right</option>
                  <option value="custom">Custom (Drag & Drop)</option>
                </select>
                
                {symbolPos === "custom" && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs ">Drag Mode</span>
                      <button
                        type="button"
                        onClick={() => onSettingsChange({ isDragMode: !isDragMode })}
                        data-primary={isDragMode}
                        className="px-2 py-1 rounded text-xs border transition-all"
                      >
                        {isDragMode ? "ON" : "OFF"}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="block ">X: {Math.round(logoPosition.x * 100)}%</label>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={logoPosition.x}
                          onChange={(e) => onSettingsChange({ 
                            logoPosition: { ...logoPosition, x: Number(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block ">Y: {Math.round(logoPosition.y * 100)}%</label>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={logoPosition.y}
                          onChange={(e) => onSettingsChange({ 
                            logoPosition: { ...logoPosition, y: Number(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block ">Size: {Math.round(logoPosition.size * 100)}%</label>
                        <input
                          type="range"
                          min={0.1}
                          max={0.5}
                          step={0.01}
                          value={logoPosition.size}
                          onChange={(e) => onSettingsChange({ 
                            logoPosition: { ...logoPosition, size: Number(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
      </div>

      {/* Advanced Styling Section */}
      <div className="border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium ">
            Advanced Styling
          </label>
          <button
            type="button"
            onClick={() => onSettingsChange({ useAdvancedStyling: !useAdvancedStyling })}
            data-primary={useAdvancedStyling}
            className="px-3 py-1 rounded-lg text-xs font-medium border transition-all"
          >
            {useAdvancedStyling ? "Enabled" : "Disabled"}
          </button>
        </div>

        {useAdvancedStyling && (
          <div className="space-y-4">
            {/* Dot Type */}
            <div>
              <label className="block text-sm font-medium  mb-2">
                Dot Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { value: "square", label: "Square" },
                  { value: "dots", label: "Dots" },
                  { value: "rounded", label: "Rounded" },
                  { value: "extra-rounded", label: "Extra Round" },
                  { value: "classy", label: "Classy" },
                  { value: "classy-rounded", label: "Classy Round" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onSettingsChange({ dotType: option.value as any })}
                    data-primary={dotType === option.value}
                    className="px-2 py-1 rounded text-xs border transition-all"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Toggle */}
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium ">
                Use Gradient
              </label>
              <button
                type="button"
                onClick={() => onSettingsChange({ useGradient: !useGradient })}
                data-primary={useGradient}
                className="px-3 py-1 rounded-lg text-xs font-medium border transition-all"
              >
                {useGradient ? "On" : "Off"}
              </button>
            </div>

            {useGradient && (
              <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                {/* Gradient Type */}
                <div>
                  <label className="block text-sm font-medium  mb-1">
                    Gradient Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onSettingsChange({ gradientType: "linear" })}
                      data-primary={gradientType === "linear"}
                      className="px-3 py-1 rounded text-xs border transition-all"
                    >
                      Linear
                    </button>
                    <button
                      type="button"
                      onClick={() => onSettingsChange({ gradientType: "radial" })}
                      data-primary={gradientType === "radial"}
                      className="px-3 py-1 rounded text-xs border transition-all"
                    >
                      Radial
                    </button>
                  </div>
                </div>

                {/* Gradient Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium ">
                      Start Color
                    </label>
                    <input
                      type="color"
                      className="mt-1 w-full h-8 border border-slate-200 dark:border-slate-600 rounded cursor-pointer bg-white dark:bg-slate-700"
                      value={gradientStartColor}
                      onChange={(e) => onSettingsChange({ gradientStartColor: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium ">
                      End Color
                    </label>
                    <input
                      type="color"
                      className="mt-1 w-full h-8 border border-slate-200 dark:border-slate-600 rounded cursor-pointer bg-white dark:bg-slate-700"
                      value={gradientEndColor}
                      onChange={(e) => onSettingsChange({ gradientEndColor: e.target.value })}
                    />
                  </div>
                </div>

                {/* Gradient Rotation (only for linear) */}
                {gradientType === "linear" && (
                  <div>
                    <label className="block text-sm font-medium ">
                      Rotation ({gradientRotation}°)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      step={15}
                      value={gradientRotation}
                      onChange={(e) => onSettingsChange({ gradientRotation: Number(e.target.value) })}
                      className="mt-1 w-full"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Corner Styling */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium  mb-1">
                  Corner Square
                </label>
                <select
                  className="w-full border border rounded px-2 py-1 text-xs bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={cornerSquareType}
                  onChange={(e) => onSettingsChange({ cornerSquareType: e.target.value as any })}
                >
                  <option value="square">Square</option>
                  <option value="dot">Dot</option>
                  <option value="extra-rounded">Extra Rounded</option>
                </select>
                <input
                  type="color"
                  className="mt-1 w-full h-6 border border-slate-200 dark:border-slate-600 rounded cursor-pointer bg-white dark:bg-slate-700"
                  value={cornerSquareColor}
                  onChange={(e) => onSettingsChange({ cornerSquareColor: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium  mb-1">
                  Corner Dot
                </label>
                <select
                  className="w-full border border rounded px-2 py-1 text-xs bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={cornerDotType}
                  onChange={(e) => onSettingsChange({ cornerDotType: e.target.value as any })}
                >
                  <option value="square">Square</option>
                  <option value="dot">Dot</option>
                </select>
                <input
                  type="color"
                  className="mt-1 w-full h-6 border border-slate-200 dark:border-slate-600 rounded cursor-pointer bg-white dark:bg-slate-700"
                  value={cornerDotColor}
                  onChange={(e) => onSettingsChange({ cornerDotColor: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium shadow-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-wait"
      >
        {isGenerating ? "Generating..." : "Generate QR code"}
      </button>
    </form>
  );
};
