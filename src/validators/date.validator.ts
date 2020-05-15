import * as moment from 'moment-timezone';
import { FormControl } from '@angular/forms';

export class DateValidator {
    
    static isValid(control: FormControl): any {
       var val = control.value;
       if (val) {
           val = val.replace(/[^0-9]/g, '');
       }
       let valid = moment(val, "DDMMYYYY", true).isValid();

       return valid ? null : {"invalid": true};
    }

    //primeiro verifica se e uma data valida
    //segundo se e maior de idade
    static validateAge(control: FormControl): any {
       var val = control.value;

       if (val) {
           val = val.replace(/[^0-9]/g, '');
       }

       let valid = moment(val, "DDMMYYYY", true).isValid();

       if (valid == false) {
           return {"invalid": true};
       }

       var dataNascimento = moment(val, "DDMMYYYY");

       var anos = moment().diff(dataNascimento, 'years');

       return (anos >= 18) ? null : {"invalid": true};
    }

    // a data deve não pode ser menor que o mes e ano atual
    static validateDateVencimentoCartao(control: FormControl): any {
        var val = '01/'+control.value; //adiciona por default o primeiro dia do mes

        if (val) {
            val = val.replace(/[^0-9]/g, '');
        }
      
        let valid = moment(val, "DDMMYYYY", true).isValid();

        if (valid == false) {
            return {"invalid": true};
        }

        let dataValidadeCartao = moment(val, "DD/MM/YYYY");
        let dataMinimaValidade = moment([moment().format("YYYY"), moment().format("MM"), '01'], 'YYYY-MM-DD');

        var diferenca = dataValidadeCartao.diff(dataMinimaValidade, 'months');

        if (diferenca < 0) {
            return {"invalid": true};
        }

        return null;
    }
}