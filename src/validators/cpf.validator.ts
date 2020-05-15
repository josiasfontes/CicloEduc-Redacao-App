import { FormControl } from '@angular/forms';
 
export class CPFValidator {
 
    static isValid(control: FormControl): any {

        var val = control.value || '';

        var cpfNumber = val.replace(/[^\d]+/g,'');
        var regexCPF = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        var pesos = [10,9,8,7,6,5,4,3,2];
        var digV1 = 0;
        var digV2 = 0;

        if(regexCPF.test(val) == false) {
            return {
                "invalid": true
            };
        }

        switch (cpfNumber) {
            case '00000000000':
            case '11111111111':
            case '22222222222':
            case '33333333333':
            case '44444444444':
            case '55555555555':
            case '66666666666':
            case '77777777777':
            case '88888888888':
            case '99999999999':
                return {
                    "invalid": true
               };
        }

        var cpfArray = cpfNumber.substr(0,9).split(""),
        cpfDigitos = cpfNumber.substr(9,2);

        var calcDigV = function(numberLoop) {
            var soma = 0;
            var restoDiv = 0;
            for(var i=0; i<numberLoop; i++) {
                soma+= parseInt(cpfArray[i])*pesos[i];
            }
            restoDiv = (soma%11);
            return (restoDiv < 2) ? 0 : (11-restoDiv);
        };

        digV1 = calcDigV(9);
        pesos.unshift(11);
        cpfArray.push(digV1);
        digV2 = calcDigV(10);

        if(cpfDigitos != digV1+''+digV2) {
           return {
                "invalid": true
           };
        }
        return null;
    }
 
}