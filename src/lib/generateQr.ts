import QRCode from "qrcode";

export type GenerateQrOptions = {
  text: string;
  width: number;
  colorDark: string;
  colorLight: string;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
};

/**
 * Generates a QR code as a data URL (PNG).
 */
export async function generateQrDataUrl(
  options: GenerateQrOptions
): Promise<string> {
  const { text, width, colorDark, colorLight, errorCorrectionLevel } = options;

  return QRCode.toDataURL(text, {
    width,
    color: {
      dark: colorDark,
      light: colorLight,
    },
    errorCorrectionLevel,
    margin: 2,
  });
}

/**
 * Generates a QR code as SVG string.
 */
export async function generateQrSvg(
  options: GenerateQrOptions
): Promise<string> {
  const { text, width, colorDark, colorLight, errorCorrectionLevel } = options;

  return QRCode.toString(text, {
    type: 'svg',
    width,
    color: {
      dark: colorDark,
      light: colorLight,
    },
    errorCorrectionLevel,
    margin: 2,
  });
}

// New helpers: generate module matrix and render rounded-dot SVG/PNG
export type QrMatrix = {
  data: boolean[]; // row-major
  size: number; // number of modules per side
  margin: number; // margin in modules
};

export function generateQrMatrix(
  text: string,
  errorCorrectionLevel: "L" | "M" | "Q" | "H" = "M",
  margin = 2
): QrMatrix {
  // QRCode.create is synchronous and exposes modules.data and modules.size
  // margin is handled separately so callers can control spacing
  // @ts-ignore - modules has dynamic typing from the library
  const qr = (QRCode as any).create(text, { errorCorrectionLevel });
  const modules = qr.modules;
  const size = modules.size as number;
  const data: boolean[] = [];
  // modules.data is a flat array-like structure; access by (r * size + c)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      data.push(!!modules.get ? modules.get(r, c) : !!modules.data[r * size + c]);
    }
  }

  return { data, size, margin };
}

function isFinderModule(r: number, c: number, moduleCount: number) {
  const p = 7; // finder pattern size is 7x7
  const inTopLeft = r < p && c < p;
  const inTopRight = r < p && c >= moduleCount - p;
  const inBottomLeft = r >= moduleCount - p && c < p;
  return inTopLeft || inTopRight || inBottomLeft;
}

export function generateRoundedSvg(
  text: string,
  width: number,
  colorDark = "#000000",
  colorLight = "#ffffff",
  errorCorrectionLevel: "L" | "M" | "Q" | "H" = "M",
  dotScale = 0.85,
  marginInModules = 2
): string {
  const { data, size: moduleCount, margin } = generateQrMatrix(
    text,
    errorCorrectionLevel,
    marginInModules
  );

  const totalModules = moduleCount + margin * 2;
  const moduleSize = width / totalModules;

  const elements: string[] = [];

  // background
  elements.push(
    `<rect width="100%" height="100%" fill="${colorLight}" />`
  );

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      const v = data[r * moduleCount + c];
      if (!v) continue;

      const x = (margin + c) * moduleSize;
      const y = (margin + r) * moduleSize;

      if (isFinderModule(r, c, moduleCount)) {
        // keep finder patterns as squares for reliability
        elements.push(
          `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${colorDark}" />`
        );
      } else {
        const cx = x + moduleSize / 2;
        const cy = y + moduleSize / 2;
        const radius = (moduleSize / 2) * dotScale;
        elements.push(
          `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${colorDark}" />`
        );
      }
    }
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${width}' viewBox='0 0 ${width} ${width}' shape-rendering='crispEdges'>${elements.join("\n")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function generateRoundedDataUrl(
  text: string,
  width: number,
  colorDark = "#000000",
  colorLight = "#ffffff",
  errorCorrectionLevel: "L" | "M" | "Q" | "H" = "M",
  dotScale = 0.85,
  marginInModules = 2
): Promise<string> {
  const { data, size: moduleCount, margin } = generateQrMatrix(
    text,
    errorCorrectionLevel,
    marginInModules
  );

  const totalModules = moduleCount + margin * 2;
  const moduleSize = width / totalModules;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = width;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // background
  ctx.fillStyle = colorLight;
  ctx.fillRect(0, 0, width, width);

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      const v = data[r * moduleCount + c];
      if (!v) continue;

      const x = (margin + c) * moduleSize;
      const y = (margin + r) * moduleSize;

      if (isFinderModule(r, c, moduleCount)) {
        ctx.fillStyle = colorDark;
        ctx.fillRect(x, y, moduleSize, moduleSize);
      } else {
        const cx = x + moduleSize / 2;
        const cy = y + moduleSize / 2;
        const radius = (moduleSize / 2) * dotScale;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = colorDark;
        ctx.fill();
      }
    }
  }

  return canvas.toDataURL("image/png");
}
