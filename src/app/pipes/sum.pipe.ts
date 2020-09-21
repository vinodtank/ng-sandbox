import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sum',
    pure: false
})
export class SumPipe implements PipeTransform {
    transform(items: any[], attr: string): any {
        return items.reduce((a, b) => parseInt(a) + parseInt(b[attr]), 0);
    }
}