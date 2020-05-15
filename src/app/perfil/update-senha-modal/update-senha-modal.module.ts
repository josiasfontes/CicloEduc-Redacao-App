import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateSenhaModalPage } from './update-senha-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateSenhaModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [UpdateSenhaModalPage]
})
export class UpdateSenhaModalPageModule {}
