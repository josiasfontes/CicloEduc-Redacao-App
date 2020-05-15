import { BrMaskerModule } from 'br-mask';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagamentoCartaoModalPage } from './pagamento-cartao-modal.page';

const routes: Routes = [
    {
        path: '',
        component: PagamentoCartaoModalPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BrMaskerModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [PagamentoCartaoModalPage]
})

export class PagamentoCartaoModalPageModule {}
