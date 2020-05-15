import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';
import { UpdatePlanoModalPage } from './update-plano-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatePlanoModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [UpdatePlanoModalPage]
})
export class UpdatePlanoModalPageModule {}
