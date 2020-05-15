import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'moneyBrFormat'
})

export class MoneyBrFormatPipe implements PipeTransform {

	transform(value): any {
		if(value){
			value = parseFloat(value);
	        return this.formatMoney(value, 2, 3, '.', ',');
		}
		else{
			return this.formatMoney(0, 2, 3, '.', ',');	
		}
	}

	formatMoney(value, n, x, s, c) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')', 
        num = value.toFixed(Math.max(0, ~~n)); 

        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ',')); 
    }

}
