import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { PerfilService } from './perfil.service';
import { ApiService } from  '../providers/api.service';
import { DataService } from '../providers/data.service';
import { MessageService } from  '../providers/message.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UpdateModalPage } from './update-modal/update-modal.page';
import { PagamentoModalPage } from './pagamento-modal/pagamento-modal.page';
import { UpdateFotoModalPage } from './update-foto-modal/update-foto-modal.page';
import { UpdateSenhaModalPage } from './update-senha-modal/update-senha-modal.page';
import { UpdatePlanoModalPage } from './update-plano-modal/update-plano-modal.page';
import { ModalController, AlertController, LoadingController, Events } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: 'perfil.page.html',
  styleUrls: ['perfil.page.scss']
})
export class PerfilPage {

    planos:any = [];
    aluno:any = {};
    plano:any = {};
    boleto:any = {};
	assinatura:any = {};
    loading_data_remote:boolean;
    loading_data_assinatura:boolean;
    loading_boleto_remote: boolean;


	constructor(
        public events: Events,
		private route: Router,
        private iab: InAppBrowser,
        private msg : MessageService,
        private apiService: ApiService,
		private dataService: DataService,
		private perfilService : PerfilService,
		public alertController: AlertController,
		public modalController: ModalController,
		public loadingController: LoadingController
	) {}

    ionViewWillEnter(){
        this.aluno = {};
        this.assinatura = {};
        this.plano = {};
        this.planos = [];
        this.boleto = {};
        this.getAllDataAluno();
    }

    getAllDataAluno(){
        this.getDataAluno();
        this.getDataAssinatura();
        // this.getDataPlano();
    }
    
    getDataAluno(){
        this.presentLoading().then(
            (loadingAluno:any)=> {
                this.getDataAlunoRemote(loadingAluno);
            }
        );
    }

    getDataAssinatura(){
        this.presentLoading('Carregando..').then(
            (loading:any)=> {
                this.getDataAssinaturaRemote(loading);
            }
        );
    }

    getDataAssinaturaRemote(loading){
        this.loading_data_assinatura = true;
        this.apiService.get('assinaturas/assinatura').then(
            (dataRemote:any) => {
                this.loading_data_assinatura = false;
                loading.dismiss();
                this.assinatura = JSON.parse(dataRemote.data);
                
                // console.log('ASSINATURA-PERFIL: '+ JSON.stringify(this.assinatura));
                
                this.dataService.setAssinatura(this.assinatura);
                this.publishEventAssinatura();
                this.getDataPlano();
                
                if((this.assinatura.status == 1 || this.assinatura.status == 4) && 
                    this.assinatura.forma_pagamento == 'boleto'){
                    this.getDataBoletoRemote();
                }
            },
            (err) => {
                this.loading_data_assinatura = false;
                console.log('ERRO:'+JSON.stringify(err));
                loading.dismiss();
            }
        );
    }

    publishEventAssinatura(){
        this.events.publish('user:assinaturaSituacao', this.assinatura);
    }

    getDataPlano(){
        this.apiService.get('assinaturas/planos').then(
            (planosDataRemote:any) => {
                this.planos = JSON.parse(planosDataRemote.data);
                // console.log('PLANOS: '+JSON.stringify(this.planos));
                if(this.planos.length > 0){
                    if(this.assinatura.plano){
                        let planoSearch = this.planos.find(x => x.id === Number(this.assinatura.plano));
                        this.plano = (planoSearch) ? planoSearch : {};
                        // console.log('PLANO: '+JSON.stringify(this.plano));
                    }
                }
            },
            (err) => {
                this.msg.show('Não foi possível carregar os planos. Tente mais tarde.');
            }
        );
    }

	getDataAlunoRemote(loadingAluno){
        this.loading_data_remote = true;
        this.perfilService.listAlunoRemote().then(
            (data:any) => {
                this.loading_data_remote = false;
                // console.log('ALUNO REMOTE: '+ JSON.stringify(data));

                this.aluno = JSON.parse(data.data);

                this.updateAlunoLocal().then(
                    (data)=>{
                        this.getDataAlunoLocal(loadingAluno);
                    },
                    (err)=>{
                        // console.log('ERR UPDATE: '+ JSON.stringify(err));
                        this.getDataAlunoLocal(loadingAluno);
                    }
                );
            },
            (err) => {
                this.loading_data_remote = false;
                this.getDataAlunoLocal(loadingAluno);
                console.log('ERRO ALUNO REMOTE: '+ JSON.stringify(err));
            }
        );
    }

    getDataBoletoRemote(){
        this.boleto = {};
        this.loading_boleto_remote = true;
        this.apiService.get('assinaturas/pagar/boleto').then(
            (dataRemote:any) => {
                this.loading_boleto_remote = false;
                let dataRemoteObject = JSON.parse(dataRemote.data);
                this.boleto = dataRemoteObject;
                // console.log('DATA-REMOTE-OBJECT:'+JSON.stringify(dataRemoteObject));
            },
            (err) => {
                this.loading_boleto_remote = false;
                console.log('ERRO:'+JSON.stringify(err));
            }
        );
    }

	getDataAlunoLocal(loading) {
        this.perfilService.listAluno().then(
            (alunoLocal:any) => {
                
                // console.log('ALUNO LOCAL: '+ JSON.stringify(alunoLocal));

            	if(alunoLocal.id){
            		this.aluno = alunoLocal;
            		this.aluno.imagem = "assets/user-dois.png";
                    if(alunoLocal.nome_completo){
                        this.aluno.foto = (this.aluno.foto == null) ? "assets/user-dois.png" : this.aluno.foto;
                    }
            	}
                // else {
                //     this.saveAlunoDataLocal(this.aluno);
                // }

            	loading.dismiss();

            },
            (err) => {
            	loading.dismiss();
                console.log('ERRO-LIST-ALUNO-LOCAL: '+ JSON.stringify(err));
            }
        );
    }

    // saveAlunoDataLocal(alunoData){
    //     this.perfilService.create(alunoData).then(
    //         (alunoDataCreate:any) => {},
    //         (err) => {}
    //     );
    // }

    updateAlunoLocal(){
        return new Promise((resolve, reject) => {
            this.perfilService.update(this.aluno).then(
                (data) => {
                    // console.log('ALUNO UPDATE LOCAL: '+ JSON.stringify(data));
                    resolve(data);
                },
                (err) => {
                    reject(err);
                    console.log('ERRO_UPDATE_ALUNO_LOCAL'+ JSON.stringify(err));
                }
            );
        });
    }

	sair() {
		this.dataService.removeTokenAccess();
        this.dataService.removeTokenRefresh();
        this.dataService.removeCredentials();
        this.events.publish('user:resetFormLogin');
		this.route.navigate(['/login']);
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

    async presentAlertConfirmSair() {
		const alert = await this.alertController.create({
			header: 'Sair do Aplicativo',
			message: 'Deseja realmente <strong>SAIR</strong> ?',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					cssClass: 'secondary'
				}, 
				{
					text: 'Sair',
					handler: () => {
						this.sair();
					}
				}
			]
		});

		await alert.present();
	}

    async openGerenciarPlanoModal(){

        const modal = await this.modalController.create({
            component: UpdatePlanoModalPage
        });

        modal.onDidDismiss().then((dataParam) => {
            if(dataParam.data == 'open_gerenciar_pagamento'){
                // this.getAllDataAluno();
                this.openPagamentoModal();
            }
        })

        return await modal.present();

    }

    async openPagamentoModal(){

        const modal = await this.modalController.create({
            component: PagamentoModalPage
        });

        modal.onDidDismiss().then((dataParam) => {
            if(dataParam.data == 'refresh_data_aluno'){
                this.getAllDataAluno();
            }
        });

        return await modal.present();

    }

	async openUpdateSenha() {
        const modal = await this.modalController.create({
            component: UpdateSenhaModalPage
        });

        return await modal.present();
    }

    async openUpdate() {
        const modal = await this.modalController.create({
            component: UpdateModalPage,
            componentProps: { 
		        aluno: this.aluno
	      	}
        });


        modal.onDidDismiss().then((dataParam) => {
            if(dataParam.data == 'refresh_data_aluno'){
                this.getAllDataAluno();
            }
        });

        return await modal.present();
    }

    async openUpdateFoto() {
        const modal = await this.modalController.create({
            component: UpdateFotoModalPage,
            componentProps: { 
                aluno: this.aluno
            }
        });

        modal.onDidDismiss().then((dataParam) => {
            if(dataParam.data == 'refresh_data_aluno'){
                this.getAllDataAluno();
            }
        })

        return await modal.present();
    }

    async openCancelarAssinaturaModal() {
        const alert = await this.alertController.create({
            header: 'Cancelar Assinatura',
            message: 'Deseja realmente <strong>CANCELAR A ASSINATURA?</strong> ?',
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, 
                {
                    text: 'Sim',
                    handler: () => {
                        this.cancelarAssinaturaRemote();
                    }
                }
            ]
        });

        await alert.present();
    }

    cancelarAssinaturaRemote() {

        this.presentLoading().then(
            (loading:any)=> {

                this.perfilService.cancelarAssinaturaRemote().then(
                    (data) => {
                        loading.dismiss();
                        // console.log('CANCELAR ASSINATURA: '+ JSON.stringify(data));
                        this.msg.show('Assinatura cancelada com sucesso.');
                        this.getAllDataAluno();
                    },
                    (err) => {
                        loading.dismiss();
                        console.log('ERRO_CANCELAR_ASSINATURA: '+ JSON.stringify(err));
                        this.msg.show('Não foi possível cancelar a assinatura.');
                    }
                );
            }
        );
        
    }

}
