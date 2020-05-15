import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'cpfFormat'
})

export class CpfFormatPipe implements PipeTransform {

 	transform(value) {

 		if(value){
 			if(value.toString().length == 11){
				return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
 			}
 		}

 		return value;

  	}

}
