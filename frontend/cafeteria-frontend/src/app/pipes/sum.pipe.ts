import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {
  transform(items: any[], quantityField: string, priceField: string): number {
    return items.reduce((total, item) => 
      total + (item[quantityField] * item[priceField]), 0);
  }
}