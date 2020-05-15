import { NgModule } from '@angular/core';
import { PerfilPage } from './perfil.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		RouterModule.forChild([{ path: '', component: PerfilPage }]),
		PipesModule
	],
	declarations: [ PerfilPage ]
})

export class PerfilModule {}
