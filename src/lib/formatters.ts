/**
 * Formats a number to the correct numeral script based on language.
 * E.g., formatNumber(2026, 'bn') -> '২০২৬'
 */
export function formatNumber(value: number | string, lng: string): string {
  if (value == null) return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value.toString();

  try {
    let locale = 'en-IN';
    if (lng === 'bn') locale = 'bn-IN';
    if (lng === 'hi') locale = 'hi-IN-u-nu-deva';
    return new Intl.NumberFormat(locale, { useGrouping: false }).format(num);
  } catch (e) {
    return value.toString();
  }
}

/**
 * Same as formatNumber but keeps digit grouping (e.g., 10,000)
 */
export function formatNumberWithGrouping(value: number | string, lng: string): string {
  if (value == null) return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value.toString();

  try {
    let locale = 'en-IN';
    if (lng === 'bn') locale = 'bn-IN';
    if (lng === 'hi') locale = 'hi-IN-u-nu-deva';
    return new Intl.NumberFormat(locale).format(num);
  } catch (e) {
    return value.toString();
  }
}

/**
 * Formats a Date object to the correct language
 */
export function formatDate(dateStr: string | Date, lng: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    const date = new Date(dateStr);
    let locale = 'en-IN';
    if (lng === 'bn') locale = 'bn-IN';
    if (lng === 'hi') locale = 'hi-IN-u-nu-deva';
    
    // Default options if none provided
    const fmtOptions = options || { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat(locale, fmtOptions).format(date);
  } catch (e) {
    return String(dateStr);
  }
}
