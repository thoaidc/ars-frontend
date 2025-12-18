import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'vndCurrency'
})
export class VndCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined, rate: number = 23000): string {
    if (value === null || value === undefined || value === '') return '';
    const num = typeof value === 'string' ? parseFloat(value as string) : (value as number);
    if (isNaN(num)) return '';

    // Heuristic: if the provided number looks like a VND amount already (large integer, >= 1000)
    // treat it as VND and format directly. Otherwise assume it's a base currency (e.g. USD)
    // and convert by multiplying with rate.
    let vnd: number;
    const looksLikeVnd = Math.abs(num - Math.round(num)) < 0.0001 && Math.abs(num) >= 1000;
    if (looksLikeVnd) {
      vnd = Math.round(num);
    } else {
      vnd = Math.round(num * rate);
    }

    // format with commas as thousand separators, no decimals
    const formatted = vnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formatted} VND`;
  }
}
