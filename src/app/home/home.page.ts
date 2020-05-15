import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../providers/api.service';
import { DataService } from '../providers/data.service';
import { LoadingController, ModalController, Events } from '@ionic/angular';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss']
})

export class HomePage {

    assinatura: any = {};
    assinatura_situacao_text: string;
    assinatura_status_code: number;
    loading_data_assinatura_remote:boolean = false;

	constructor(
		private route: Router, 
        public events: Events,
        private apiService: ApiService,
        private dataService: DataService,
        public modalController: ModalController,
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
                this.loading_data_assinatura_remote = true;

                this.apiService.get('assinaturas/assinatura').then(
                    (dataRemote:any) => {
                        this.loading_data_assinatura_remote = false;

                        loading.dismiss();
                        this.assinatura = JSON.parse(dataRemote.data);
                        this.assinatura_situacao_text = this.getSituacaoAssinatura(this.assinatura.status);
                        this.assinatura_status_code = this.assinatura.status;
                        this.publishEventAssinatura();
                        this.saveAssinaturaStorageLocal(this.assinatura);

                        // console.log('ASSINATURA: '+ JSON.stringify(this.assinatura));
                    },
                    (err) => {
                        console.log('ERRO:'+JSON.stringify(err));
                        this.loading_data_assinatura_remote = false;
                        loading.dismiss();
                    }
                );
            }
        );
    }

    publishEventAssinatura(){
        this.events.publish('user:assinaturaSituacao', this.assinatura);
    }

    saveAssinaturaStorageLocal(assinatura){
        this.dataService.setAssinatura(assinatura);
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

    async presentLoading(msg?) {

        let messageLoading = (msg) ? msg : 'Carregando...';

        const loading = await this.loadingController.create({
          message: messageLoading
        });

        await loading.present();

        return loading;
    }

}
