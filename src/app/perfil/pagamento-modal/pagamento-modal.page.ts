import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, LoadingController, Events } from '@ionic/angular';
import { PagamentoCartaoModalPage } from './pagamento-cartao-modal/pagamento-cartao-modal.page';
import { PagamentoBoletoModalPage } from './pagamento-boleto-modal/pagamento-boleto-modal.page';

@Component({
	selector: 'app-pagamento-modal',
	templateUrl: './pagamento-modal.page.html',
	styleUrls: ['./pagamento-modal.page.scss'],
})

export class PagamentoModalPage implements OnInit {

    boleto:any = {
        paymentLink: null
    };
	assinatura: any = {};
    assinatura_situacao_text: string;
    assinatura_status_code: number;
    loadingRequestAssinatura:boolean = false;
    loading_boleto_remote: boolean = false;

  	constructor(
        public events: Events,
        private iab: InAppBrowser,
        private apiService: ApiService,
  		private modalController: ModalController,
  		public loadingController: LoadingController
	) {}

  	ngOnInit() {}

  	ionViewWillEnter(){
        this.assinatura = {}
        this.assinatura_situacao_text = '';
        this.assinatura_status_code = null;
        this.getDataAssinaturaRemote();
    }

    getDataAssinaturaRemote(){

        this.presentLoading().then(
            (loading:any)=> {

                this.loadingRequestAssinatura = true;
                
                this.apiService.get('assinaturas/assinatura').then(
                    (dataRemote:any) => {
                        this.loadingRequestAssinatura = false;
                        loading.dismiss();
                        this.assinatura = JSON.parse(dataRemote.data);
                        this.assinatura_situacao_text = this.getSituacaoAssinatura(this.assinatura.status);
                        this.assinatura_status_code = this.assinatura.status;
                        this.publishEventAssinatura();

                        if((this.assinatura.status == 1 || this.assinatura.status == 4) && 
                            this.assinatura.forma_pagamento == 'boleto'){
                            this.getDataBoletoRemote();
                        }
                    },
                    (err) => {
                        this.loadingRequestAssinatura = false;
                        console.log('ERRO:'+JSON.stringify(err));
                        loading.dismiss();
                    }
                );
            }
        );
    }

    getDataBoletoRemote(){
        this.loading_boleto_remote = true;
        this.apiService.get('assinaturas/pagar/boleto').then(
            (dataRemote:any) => {
                this.loading_boleto_remote = false;
                let dataRemoteObject = JSON.parse(dataRemote.data);
                this.boleto.paymentLink = dataRemoteObject.paymentLink;
                // console.log('DATA-REMOTE-OBJECT:'+JSON.stringify(dataRemoteObject));
            },
            (err) => {
                this.loading_boleto_remote = false;
                console.log('ERRO:'+JSON.stringify(err));
            }
        );
    }

    publishEventAssinatura(){
        this.events.publish('user:assinaturaSituacao', this.assinatura);
    }

    getSituacaoAssinatura(status) {
        
        var assinaturaTipos = { 
            0: 'Pendente',
            1: 'Ativa',
            2: 'Expirada',
            3: 'Cancelada',
            4: 'Aguardando Pagamento'
        };

        return assinaturaTipos[status];
    }

    abrirBoleto(link){
        const browser = this.iab.create(link, '_system');
    }

    async presentLoading(msg?) {

        let messageLoading = (msg) ? msg : 'Carregando...';

        const loading = await this.loadingController.create({
          message: messageLoading
        });

        await loading.present();

        return loading;
    }

  	async openCartaoCreditoModal() {

        const modal = await this.modalController.create({
            component: PagamentoCartaoModalPage
        });

        modal.onDidDismiss().then((dataParam) => {
            if(dataParam.data == 'refresh_data_assinatura'){
                this.getDataAssinaturaRemote();
            }
        })

        return await modal.present();
    }

    async openBoletoModal() {

        const modal = await this.modalController.create({
            component: PagamentoBoletoModalPage
        });

        modal.onDidDismiss().then((dataParam) => {
            if(dataParam.data == 'refresh_data_assinatura'){
                this.getDataAssinaturaRemote();
            }
        })

        return await modal.present();
    }

	async closeModal(onClosedData) {
    	// const onClosedData: string = "Wrapped Up!";
    	await this.modalController.dismiss(onClosedData);
	}

}
