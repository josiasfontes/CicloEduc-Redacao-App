import { BrMaskerModule } from 'br-mask';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CadastroModalPage } from './cadastro-modal.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        path: '',
        component: CadastroModalPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        BrMaskerModule
    ],
    declarations: [CadastroModalPage]
})

export class CadastroModalPageModule {}
