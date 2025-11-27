declare module 'qr-code-styling' {
  export interface QRCodeStylingOptions {
    width?: number;
    height?: number;
    type?: 'svg' | 'canvas' | 'png' | 'jpeg' | 'webp';
    data?: string;
    image?: string;
    margin?: number;
    qrOptions?: {
      typeNumber?: number;
      mode?: string;
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    };
    imageOptions?: {
      hideBackgroundDots?: boolean;
      imageSize?: number;
      margin?: number;
      crossOrigin?: string;
      saveAsBlob?: boolean;
    };
    dotsOptions?: {
      color?: string;
      gradient?: {
        type?: 'linear' | 'radial';
        rotation?: number;
        colorStops?: Array<{
          offset: number;
          color: string;
        }>;
      };
      type?: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
    };
    cornersSquareOptions?: {
      color?: string;
      gradient?: {
        type?: 'linear' | 'radial';
        rotation?: number;
        colorStops?: Array<{
          offset: number;
          color: string;
        }>;
      };
      type?: 'square' | 'dot' | 'extra-rounded';
    };
    cornersDotOptions?: {
      color?: string;
      gradient?: {
        type?: 'linear' | 'radial';
        rotation?: number;
        colorStops?: Array<{
          offset: number;
          color: string;
        }>;
      };
      type?: 'square' | 'dot';
    };
    backgroundOptions?: {
      color?: string;
      gradient?: {
        type?: 'linear' | 'radial';
        rotation?: number;
        colorStops?: Array<{
          offset: number;
          color: string;
        }>;
      };
    };
  }

  export default class QRCodeStyling {
    constructor(options?: QRCodeStylingOptions);
    
    append(container: HTMLElement): void;
    getRawData(extension?: string): Promise<Blob | null>;
    update(options: Partial<QRCodeStylingOptions>): void;
    download(downloadOptions?: {
      name?: string;
      extension?: string;
    }): void;
  }
}
