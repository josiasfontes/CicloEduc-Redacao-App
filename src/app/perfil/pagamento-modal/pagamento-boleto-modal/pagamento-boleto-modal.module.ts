import { BrMaskerModule } from 'br-mask';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagamentoBoletoModalPage } from './pagamento-boleto-modal.page';
import { PipesModule } from '../../../pipes/pipes.module';

const routes: Routes = [
    {
        path: '',
        component: PagamentoBoletoModalPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BrMaskerModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        PipesModule
    ],
    declarations: [PagamentoBoletoModalPage]
})

export class PagamentoBoletoModalPageModule {}
