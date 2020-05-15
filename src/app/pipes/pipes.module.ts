import { NgModule } from '@angular/core';
import { CpfFormatPipe } from './cpf-format.pipe';
import { DateBrFormatPipe } from './date-br-format.pipe';
import { MoneyBrFormatPipe } from './money-br-format.pipe';

@NgModule({
	declarations: [ CpfFormatPipe, DateBrFormatPipe, MoneyBrFormatPipe ],
	imports: [],
	exports: [ CpfFormatPipe, DateBrFormatPipe, MoneyBrFormatPipe ],
})

export class PipesModule {}