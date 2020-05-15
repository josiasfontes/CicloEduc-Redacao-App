import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateBrFormat'
})
export class DateBrFormatPipe implements PipeTransform {

  transform(value): any {

  	var data = value;
	var dataFormatada = data.replace(/(\d*)-(\d*)-(\d*).*/, '$3-$2-$1');
	
    return dataFormatada;
  }

}
