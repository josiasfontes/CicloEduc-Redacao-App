import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UpdateFotoModalPage } from './update-foto-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateFotoModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UpdateFotoModalPage]
})
export class UpdateFotoModalPageModule {}
