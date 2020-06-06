import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { DataService } from '../providers/data.service';
import { PerfilService } from '../perfil/perfil.service';
import { MessageService } from  '../providers/message.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CadastroModalPage } from './cadastro-modal/cadastro-modal.page';
import { ModalController, LoadingController, Events } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

    loginForm: FormGroup;
    data: any;

    constructor(
        private route: Router,
        public events: Events,
        public msg: MessageService,
        public authService: AuthService,
        public dataService: DataService,
        public formBuilder: FormBuilder, 
        private perfilService: PerfilService,
        public modalController: ModalController,
        public loadingController: LoadingController
    ) { 
        
        this.data = {
            email: '',
            password: ''
        };

        this.loginForm = formBuilder.group({
            email: [
                '', 
                // 'josiasfontesjp@gmail.com', 
                Validators.compose([
                    Validators.required
                ])
            ],
            password: [
                '', 
                // 'josias2020', 
                Validators.compose([
                    Validators.required
                ])
            ]
        });

        this.events.subscribe('user:resetFormLogin', () => {
            this.resetFormLogin();
        });
    }

    ngOnInit() {}

    start() {
        this.route.navigate(['/start']);
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
          message: 'Conectando...'
        });

        await loading.present();

        return loading;
    }

    login() {

        if(!this.loginForm.valid) {
            // console.log('Preencha os campos de usuario e senha.');
            this.msg.show('Preencha os campos de usuario e senha.');
            return false;
        }
        
        this.data = this.loginForm.value;

        this.presentLoading().then(
            (loading:any)=> {

                // this.loginRemoto(loading);

                this.dataService.getLastLogin().then((value) => {

                    if(value && (value != this.data.email)){

                        this.perfilService.clearDataPerfil().then(
                            (dataClear:any) => {
                                // console.log('ALUNO DATA CLEAR: '+ JSON.stringify(dataClear));
                                this.loginRemoto(loading);
                            },
                            (err) => {
                                loading.dismiss();
                                console.log('ERR ALUNO DATA CLEAR: '+ JSON.stringify(err));
                            }
                        );
                    }
                    else {
                        this.loginRemoto(loading);
                    }
                });

            }
        );
    }

    loginRemoto(loading) {
        // loading.dismiss();
        this.authService.login(this.data).then(
            (data:any) => {
                // console.log(JSON.stringify(data));
                this.redirectAfterLoginSuccess(loading);
                this.checkExistAlunoData();
                this.saveLogin();

        //         this.saveClienteLocal(data.cliente);
            },
            (err) => {
                console.log('ERR LOGIN REMOTO: '+ JSON.stringify(err));
                this.loginFailure(err, loading);
            }
        );
    }

    saveLogin() {
        this.dataService.setLastLogin(this.data.email);
    }

    redirectAfterLoginSuccess(loading){
        loading.dismiss();
        this.route.navigate(['/start']);
    }

    loginFailure(err, loading) {
        if(err.status == -1) {
            loading.dismiss();
            let message = 'Verifique sua conexão com a internet.';
            this.loginForm.reset();
            this.msg.show(message);
            return false;
        }

        this.loginForm.reset();
        loading.dismiss();
        let message = 'Usuário ou senha incorretos.';
        this.msg.show(message);
    }

    checkExistAlunoData(){

        this.perfilService.listAluno().then(
            (alunoData:any) => {
                
                // console.log('ALUNO DATA LOCAL: '+ JSON.stringify(alunoData));

                if(!alunoData.id){
                    this.perfilService.listAlunoRemote().then(
                        (dataAlunoRemote:any) => {
                            this.saveAlunoDataLocal(dataAlunoRemote);
                        },
                        (err) => {}
                    );
                }
            },
            (err) => {
                console.log('ERR LIST ALUNO LOCAL: '+ JSON.stringify(err));
            }
        );
    }

    saveAlunoDataLocal(alunoData){
        // this.perfilService.create(alunoData).then(
        //     (alunoDataCreate:any) => {},
        //     (err) => {}
        // );
        this.perfilService.update(alunoData).then(
            (data) => {
                console.log('ALUNO UPDATE LOCAL: '+ JSON.stringify(data));
            },
            (err) => {
                console.log('ERRO_UPDATE_ALUNO_LOCAL'+ JSON.stringify(err));
            }
        );
    }
    
    resetFormLogin(){
        this.loginForm.reset();
    }


    async openCadastro() {
        const modal = await this.modalController.create({
            component: CadastroModalPage
        });

        return await modal.present();
    }



}
