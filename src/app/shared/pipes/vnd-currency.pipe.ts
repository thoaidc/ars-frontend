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
    // convert by rate (assume input is in USD or base unit)
    const vnd = Math.round(num * rate);
    // format with commas as thousand separators, no decimals
    const formatted = vnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formatted} VND`;
  }
}
