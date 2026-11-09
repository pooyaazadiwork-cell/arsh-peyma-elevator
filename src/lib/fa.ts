const FA = "۰۱۲۳۴۵۶۷۸۹";

/** Convert latin digits to Persian digits. */
export function fa(value: number | string, pad = 0): string {
  let s = String(value);
  if (pad > 0) s = s.padStart(pad, "0");
  return s.replace(/[0-9]/g, (d) => FA[+d]);
}

/** Format meters with Persian digits, e.g. 12 -> «۱۲ متر» */
export function faMeters(v: number): string {
  return fa(Math.max(0, Math.round(v * 10) / 10)) ;
}
