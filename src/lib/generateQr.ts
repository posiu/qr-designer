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
