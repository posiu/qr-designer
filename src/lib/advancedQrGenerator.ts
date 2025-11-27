import QRCodeStyling, { type QRCodeStylingOptions } from 'qr-code-styling';

export type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type CornerSquareType = 'square' | 'dot' | 'extra-rounded';
export type CornerDotType = 'square' | 'dot';
export type GradientType = 'linear' | 'radial';

export interface ColorStop {
  offset: number;
  color: string;
}

export interface Gradient {
  type: GradientType;
  rotation?: number;
  colorStops: ColorStop[];
}

export interface AdvancedQrOptions {
  text: string;
  width: number;
  height?: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  
  // Dots styling
  dotsColor?: string;
  dotsGradient?: Gradient;
  dotsType?: DotType;
  
  // Background styling
  backgroundColor?: string;
  backgroundGradient?: Gradient;
  
  // Corner squares styling
  cornerSquareColor?: string;
  cornerSquareGradient?: Gradient;
  cornerSquareType?: CornerSquareType;
  
  // Corner dots styling
  cornerDotColor?: string;
  cornerDotGradient?: Gradient;
  cornerDotType?: CornerDotType;
  
  // Logo/Image options
  image?: string;
  imageSize?: number;
  imageMargin?: number;
  hideBackgroundDots?: boolean;
}

export class AdvancedQrGenerator {
  private qrCode: QRCodeStyling;
  private currentOptions: AdvancedQrOptions;
  
  constructor(options: AdvancedQrOptions) {
    this.currentOptions = { ...options };
    this.qrCode = new QRCodeStyling(this.buildOptions(options));
  }
  
  private buildOptions(options: AdvancedQrOptions): QRCodeStylingOptions {
    const qrOptions: QRCodeStylingOptions = {
      width: options.width,
      height: options.height || options.width,
      type: 'canvas',
      data: options.text,
      margin: 10,
      qrOptions: {
        errorCorrectionLevel: options.errorCorrectionLevel,
      },
      dotsOptions: {
        color: options.dotsColor,
        type: options.dotsType || 'square',
      },
      backgroundOptions: {
        color: options.backgroundColor,
      },
    };

    // Add dots gradient if provided
    if (options.dotsGradient) {
      qrOptions.dotsOptions!.gradient = options.dotsGradient;
      delete qrOptions.dotsOptions!.color;
    }

    // Add background gradient if provided
    if (options.backgroundGradient) {
      qrOptions.backgroundOptions!.gradient = options.backgroundGradient;
      delete qrOptions.backgroundOptions!.color;
    }

    // Add corner squares styling
    if (options.cornerSquareColor || options.cornerSquareGradient || options.cornerSquareType) {
      qrOptions.cornersSquareOptions = {
        color: options.cornerSquareColor,
        type: options.cornerSquareType || 'square',
      };
      
      if (options.cornerSquareGradient) {
        qrOptions.cornersSquareOptions.gradient = options.cornerSquareGradient;
        delete qrOptions.cornersSquareOptions.color;
      }
    }

    // Add corner dots styling
    if (options.cornerDotColor || options.cornerDotGradient || options.cornerDotType) {
      qrOptions.cornersDotOptions = {
        color: options.cornerDotColor,
        type: options.cornerDotType || 'square',
      };
      
      if (options.cornerDotGradient) {
        qrOptions.cornersDotOptions.gradient = options.cornerDotGradient;
        delete qrOptions.cornersDotOptions.color;
      }
    }

    // Add image options
    if (options.image) {
      qrOptions.image = options.image;
      qrOptions.imageOptions = {
        hideBackgroundDots: options.hideBackgroundDots ?? true,
        imageSize: options.imageSize || 0.4,
        margin: options.imageMargin || 0,
        crossOrigin: 'anonymous',
      };
    }

    return qrOptions;
  }
  
  update(options: Partial<AdvancedQrOptions>): void {
    this.currentOptions = { ...this.currentOptions, ...options };
    this.qrCode.update(this.buildOptions(this.currentOptions));
  }
  
  private getCurrentOptions(): AdvancedQrOptions {
    return this.currentOptions;
  }
  
  async getCanvas(): Promise<HTMLCanvasElement | null> {
    return new Promise((resolve) => {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);
      
      this.qrCode.append(container);
      
      // Wait for rendering
      setTimeout(() => {
        const canvas = container.querySelector('canvas');
        document.body.removeChild(container);
        resolve(canvas);
      }, 100);
    });
  }
  
  async getPngDataUrl(): Promise<string> {
    const canvas = await this.getCanvas();
    if (!canvas) throw new Error('Failed to generate canvas');
    return canvas.toDataURL('image/png');
  }
  
  async getSvgString(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const tempQr = new QRCodeStyling({
          ...this.buildOptions(this.getCurrentOptions()),
          type: 'svg',
        });
        
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.width = '1px';
        container.style.height = '1px';
        container.style.overflow = 'hidden';
        document.body.appendChild(container);
        
        tempQr.append(container);
        
        // Give more time for SVG generation and try multiple times
        let attempts = 0;
        const maxAttempts = 10;
        
        const checkForSvg = () => {
          attempts++;
          const svg = container.querySelector('svg');
          
          if (svg && svg.outerHTML.length > 100) {
            // SVG found and has content
            const svgString = svg.outerHTML;
            document.body.removeChild(container);
            resolve(svgString);
          } else if (attempts < maxAttempts) {
            // Try again after a short delay
            setTimeout(checkForSvg, 50);
          } else {
            // Max attempts reached, cleanup and reject
            document.body.removeChild(container);
            reject(new Error('Failed to generate SVG after multiple attempts'));
          }
        };
        
        // Start checking after initial delay
        setTimeout(checkForSvg, 100);
        
      } catch (error) {
        reject(new Error(`SVG generation error: ${error}`));
      }
    });
  }
  
  async downloadPng(filename: string = 'qr-code.png'): Promise<void> {
    const dataUrl = await this.getPngDataUrl();
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }
  
  async downloadSvg(filename: string = 'qr-code.svg'): Promise<void> {
    const svgString = await this.getSvgString();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }
}

// Predefined gradient presets
export const gradientPresets = {
  sunset: {
    type: 'linear' as GradientType,
    rotation: 45,
    colorStops: [
      { offset: 0, color: '#ff7e5f' },
      { offset: 1, color: '#feb47b' }
    ]
  },
  ocean: {
    type: 'linear' as GradientType,
    rotation: 135,
    colorStops: [
      { offset: 0, color: '#667eea' },
      { offset: 1, color: '#764ba2' }
    ]
  },
  neon: {
    type: 'radial' as GradientType,
    colorStops: [
      { offset: 0, color: '#00f5ff' },
      { offset: 1, color: '#fc00ff' }
    ]
  },
  forest: {
    type: 'linear' as GradientType,
    rotation: 90,
    colorStops: [
      { offset: 0, color: '#134e5e' },
      { offset: 1, color: '#71b280' }
    ]
  },
  fire: {
    type: 'radial' as GradientType,
    colorStops: [
      { offset: 0, color: '#ff9a9e' },
      { offset: 0.5, color: '#fecfef' },
      { offset: 1, color: '#fecfef' }
    ]
  }
};
