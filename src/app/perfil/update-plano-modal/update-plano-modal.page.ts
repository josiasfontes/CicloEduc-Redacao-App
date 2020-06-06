import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { DataService } from '../../providers/data.service';
import { MessageService } from  '../../providers/message.service';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-update-plano-modal',
	templateUrl: './update-plano-modal.page.html',
	styleUrls: ['./update-plano-modal.page.scss'],
})

export class UpdatePlanoModalPage implements OnInit {

	planos:any = [];
	plano:any = {};
	plano_id:number = null;
	loading_data_plano:boolean;

	constructor(
  		// public events: Events,
  		public msg: MessageService,
		private apiService: ApiService,
		private dataService: DataService,
  		private modalController: ModalController,
  		public loadingController: LoadingController
	) { 
		this.getDataPlanosRemote();
	}

	ngOnInit() {
	}

	getDataPlanosRemote(){

        this.presentLoading().then(
            (loading:any)=> {

            	this.loading_data_plano = true;

                this.apiService.get('assinaturas/planos').then(
                    (planosDataRemote:any) => {
                        this.planos = JSON.parse(planosDataRemote.data);
                    	this.loading_data_plano = false;
                        loading.dismiss();
                        // console.log('PLANOS: '+JSON.stringify(this.planos));
                    },
                    (err) => {
                    	this.msg.show('Não foi possível carregar os planos. Tente mais tarde.');
                    	this.loading_data_plano = false;
                        console.log('ERRO:'+JSON.stringify(err));
                        loading.dismiss();
                    }
                );
            }
        );
    }

    salvar(){
    	this.presentLoading().then(
            (loading:any)=> {

		    	this.apiService.put('assinaturas/assinatura', {
		    		plano: this.plano_id
		    	}).then(
		            (data) => {
                        loading.dismiss();
		            	// console.log('DATA:'+JSON.stringify(data));
                        this.closeModal('open_gerenciar_pagamento');
		            	// this.getDataAssinaturaRemote(loading);
		            },
		            (err) => {
		            	loading.dismiss();
		            	this.msg.show('Não foi possível atualizar o plano.');
		            	console.log('ERRO:'+JSON.stringify(err));
		            }
		        );
 			}
        );
    }

    // getDataAssinaturaRemote(loading){
    //     this.apiService.get('assinaturas/minha-assinatura/').then(
    //         (dataRemote:any) => {
    //             loading.dismiss();
    //         	let assinatura = JSON.parse(dataRemote.data);
    //             // console.log('ASSINATURA: '+ JSON.stringify(assinatura));
    //         	this.dataService.setAssinatura(assinatura);
    //         	this.publishEventAssinatura(assinatura);
    //         	this.closeModal('refresh_data_aluno');
    //         },
    //         (err) => {
    //             console.log('ERRO:'+JSON.stringify(err));
    //             loading.dismiss();
    //         }
    //     );
    // }

    // publishEventAssinatura(assinatura){
    //     this.events.publish('user:assinaturaSituacao', assinatura);
    // }

	async presentLoading(msg?) {
        let messageLoading = (msg) ? msg : 'Carregando...';

        const loading = await this.loadingController.create({
          message: messageLoading
        });

        await loading.present();

        return loading;
    }

	async closeModal(onClosedData) {
    	// const onClosedData: string = "Wrapped Up!";
    	await this.modalController.dismiss(onClosedData);
	}
}
