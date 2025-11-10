/**
 * Color Utilities - LEP System
 *
 * Funções utilitárias para manipulação e validação de cores.
 * Suporta validação de contraste WCAG, conversão de formatos e geração de variantes.
 */

// ============================================================================
// HEX TO RGB CONVERSION
// ============================================================================

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Converte cor HEX para RGB
 * @param hex - Cor em formato HEX (#RRGGBB ou RRGGBB)
 * @returns Objeto com valores R, G, B
 */
export function hexToRgb(hex: string): RGB {
  // Remove # se presente
  const cleanHex = hex.replace('#', '');

  if (cleanHex.length !== 6) {
    throw new Error(`Invalid HEX color: ${hex}. Expected format: #RRGGBB`);
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
}

// ============================================================================
// RGB TO HEX CONVERSION
// ============================================================================

/**
 * Converte RGB para HEX
 * @param rgb - Objeto com valores R, G, B ou valores individuais
 * @returns Cor em formato HEX com #
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// ============================================================================
// LUMINANCE CALCULATION (WCAG)
// ============================================================================

/**
 * Calcula a luminância relativa de uma cor (WCAG)
 * Usada para calcular contraste entre cores
 * @param hex - Cor em formato HEX
 * @returns Valor de luminância entre 0 e 1
 */
export function calculateLuminance(hex: string): number {
  const rgb = hexToRgb(hex);

  // Normaliza valores para 0-1
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Aplica gamma correction
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calcula luminância relativa
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// ============================================================================
// CONTRAST RATIO (WCAG)
// ============================================================================

/**
 * Calcula o contraste WCAG entre duas cores
 * @param hex1 - Primeira cor em HEX
 * @param hex2 - Segunda cor em HEX
 * @returns Valor de contraste entre 1:1 e 21:1
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = calculateLuminance(hex1);
  const l2 = calculateLuminance(hex2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// ============================================================================
// ACCESSIBILITY VALIDATION
// ============================================================================

export type AccessibilityLevel = 'AAA' | 'AA' | 'FAIL';

export interface AccessibilityCheckResult {
  level: AccessibilityLevel;
  ratio: number;
  isAccessible: boolean;
  message: string;
}

/**
 * Valida se o contraste entre duas cores atende aos padrões WCAG
 *
 * WCAG Contrast Ratios:
 * - AAA (Enhanced): 7:1 ou superior (recomendado para todo o texto)
 * - AA (Standard): 4.5:1 ou superior (mínimo para texto normal)
 * - FAIL: Menos de 4.5:1
 *
 * @param foreground - Cor do texto em HEX
 * @param background - Cor de fundo em HEX
 * @param level - Nível desejado: 'AA' ou 'AAA' (padrão: 'AA')
 * @returns Resultado da validação
 */
export function validateContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): AccessibilityCheckResult {
  const ratio = getContrastRatio(foreground, background);

  let resultLevel: AccessibilityLevel;
  let message: string;

  if (ratio >= 7) {
    resultLevel = 'AAA';
    message = `Excelente contraste! Ratio: ${ratio.toFixed(2)}:1 (WCAG AAA)`;
  } else if (ratio >= 4.5) {
    resultLevel = 'AA';
    message = `Bom contraste. Ratio: ${ratio.toFixed(2)}:1 (WCAG AA)`;
  } else {
    resultLevel = 'FAIL';
    message = `Contraste insuficiente. Ratio: ${ratio.toFixed(2)}:1 (mínimo 4.5:1)`;
  }

  return {
    level: resultLevel,
    ratio: parseFloat(ratio.toFixed(2)),
    isAccessible: level === 'AA' ? ratio >= 4.5 : ratio >= 7,
    message,
  };
}

// ============================================================================
// AUTO TEXT COLOR
// ============================================================================

/**
 * Determina automaticamente se o texto deve ser branco ou preto
 * baseado na cor de fundo
 * @param backgroundHex - Cor de fundo em HEX
 * @returns '#FFFFFF' para fundo escuro, '#000000' para fundo claro
 */
export function getAutoTextColor(backgroundHex: string): '#FFFFFF' | '#000000' {
  const luminance = calculateLuminance(backgroundHex);
  // Se luminância > 0.5, é uma cor clara, usar texto preto
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// ============================================================================
// HEX VALIDATION
// ============================================================================

/**
 * Valida se uma string é uma cor HEX válida
 * @param hex - String a validar
 * @returns true se é HEX válido, false caso contrário
 */
export function isValidHex(hex: string): boolean {
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
}

/**
 * Normaliza uma cor HEX para o formato padrão (#RRGGBB)
 * @param hex - Cor em HEX (pode ser #RGB ou #RRGGBB)
 * @returns Cor normalizada em #RRGGBB
 */
export function normalizeHex(hex: string): string {
  if (!isValidHex(hex)) {
    throw new Error(`Invalid HEX color: ${hex}`);
  }

  let cleaned = hex.replace('#', '').toUpperCase();

  // Expande formato curto (#RGB para #RRGGBB)
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((char) => char + char)
      .join('');
  }

  return `#${cleaned}`;
}

// ============================================================================
// COLOR BRIGHTNESS
// ============================================================================

/**
 * Calcula o brilho percebido de uma cor (0-255)
 * @param hex - Cor em HEX
 * @returns Valor de brilho entre 0 (mais escuro) e 255 (mais claro)
 */
export function getColorBrightness(hex: string): number {
  const rgb = hexToRgb(hex);
  // Fórmula de brilho percebido
  return Math.sqrt(
    rgb.r * rgb.r * 0.241 + rgb.g * rgb.g * 0.691 + rgb.b * rgb.b * 0.068
  );
}

// ============================================================================
// COLOR DARKENING / LIGHTENING
// ============================================================================

/**
 * Deixa uma cor mais escura
 * @param hex - Cor em HEX
 * @param percent - Porcentagem para escurecer (0-100)
 * @returns Cor escurecida em HEX
 */
export function darkenColor(hex: string, percent: number = 20): string {
  const rgb = hexToRgb(hex);
  const factor = 1 - percent / 100;

  return rgbToHex(
    Math.round(rgb.r * factor),
    Math.round(rgb.g * factor),
    Math.round(rgb.b * factor)
  );
}

/**
 * Deixa uma cor mais clara
 * @param hex - Cor em HEX
 * @param percent - Porcentagem para clarear (0-100)
 * @returns Cor clareada em HEX
 */
export function lightenColor(hex: string, percent: number = 20): string {
  const rgb = hexToRgb(hex);
  const factor = 1 + percent / 100;

  return rgbToHex(
    Math.min(255, Math.round(rgb.r * factor)),
    Math.min(255, Math.round(rgb.g * factor)),
    Math.min(255, Math.round(rgb.b * factor))
  );
}

// ============================================================================
// AUTO DARK VARIANT GENERATION
// ============================================================================

/**
 * Gera automaticamente uma variante escura de uma cor
 * Útil para gerar pares light/dark de cores de brand
 * @param lightHex - Cor clara em HEX
 * @param darkPercent - Porcentagem de escurecimento (padrão: 30)
 * @returns Cor escura em HEX
 */
export function generateDarkVariant(lightHex: string, darkPercent: number = 30): string {
  return darkenColor(lightHex, darkPercent);
}

/**
 * Gera automaticamente uma variante clara de uma cor
 * @param darkHex - Cor escura em HEX
 * @param lightPercent - Porcentagem de clareamento (padrão: 30)
 * @returns Cor clara em HEX
 */
export function generateLightVariant(darkHex: string, lightPercent: number = 30): string {
  return lightenColor(darkHex, lightPercent);
}

// ============================================================================
// COLOR BLENDING
// ============================================================================

/**
 * Mescla duas cores com uma opacity especificada
 * @param foreground - Cor frontal em HEX
 * @param background - Cor de fundo em HEX
 * @param opacity - Opacidade da cor frontal (0-1)
 * @returns Cor resultante em HEX
 */
export function blendColors(foreground: string, background: string, opacity: number = 0.5): string {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  const clamp = (value: number) => Math.max(0, Math.min(255, value));

  const r = clamp(bg.r * (1 - opacity) + fg.r * opacity);
  const g = clamp(bg.g * (1 - opacity) + fg.g * opacity);
  const b = clamp(bg.b * (1 - opacity) + fg.b * opacity);

  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

// ============================================================================
// COLOR INFORMATION
// ============================================================================

export interface ColorInfo {
  hex: string;
  rgb: RGB;
  luminance: number;
  brightness: number;
  isDark: boolean;
  isLight: boolean;
}

/**
 * Retorna informações detalhadas sobre uma cor
 * @param hex - Cor em HEX
 * @returns Objeto com informações da cor
 */
export function getColorInfo(hex: string): ColorInfo {
  const normalized = normalizeHex(hex);
  const rgb = hexToRgb(normalized);
  const luminance = calculateLuminance(normalized);
  const brightness = getColorBrightness(normalized);

  return {
    hex: normalized,
    rgb,
    luminance: parseFloat(luminance.toFixed(4)),
    brightness: parseFloat(brightness.toFixed(2)),
    isDark: luminance < 0.5,
    isLight: luminance >= 0.5,
  };
}

// ============================================================================
// SEMANTIC COLOR VALIDATION
// ============================================================================

export interface SemanticColorValidation {
  colorName: string;
  backgroundColor: string;
  valid: boolean;
  warnings: string[];
}

/**
 * Valida cores semânticas (success, warning, destructive) contra o fundo
 * Garante que cores semânticas sejam distinguíveis e acessíveis
 *
 * @param semanticColor - Cor semântica em HEX
 * @param backgroundColor - Cor de fundo em HEX
 * @param colorName - Nome da cor (ex: 'success', 'warning', 'destructive')
 * @returns Resultado da validação
 */
export function validateSemanticColor(
  semanticColor: string,
  backgroundColor: string,
  colorName: string = 'semantic'
): SemanticColorValidation {
  const warnings: string[] = [];

  if (!isValidHex(semanticColor) || !isValidHex(backgroundColor)) {
    return {
      colorName,
      backgroundColor,
      valid: false,
      warnings: ['Cores inválidas'],
    };
  }

  const contrast = validateContrast(semanticColor, backgroundColor);

  if (contrast.level === 'FAIL') {
    warnings.push(`⚠️ ${colorName}: Contraste insuficiente (${contrast.ratio.toFixed(2)}:1)`);
  } else if (contrast.level === 'AA') {
    warnings.push(`ℹ️ ${colorName}: Contraste AA, recomenda-se AAA (${contrast.ratio.toFixed(2)}:1)`);
  }

  return {
    colorName,
    backgroundColor,
    valid: contrast.isAccessible,
    warnings,
  };
}
