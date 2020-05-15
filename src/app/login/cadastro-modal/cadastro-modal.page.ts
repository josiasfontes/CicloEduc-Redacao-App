import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { MessageService } from  '../../providers/message.service';
import { CPFValidator } from '../../../validators/cpf.validator';
import { DateValidator } from '../../../validators/date.validator';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-cadastro-modal',
    templateUrl: './cadastro-modal.page.html',
    styleUrls: ['./cadastro-modal.page.scss'],
})

export class CadastroModalPage implements OnInit {

    cadastroForm: FormGroup;
    msgErrors:any = {};
    submitForm = false;

    constructor(
        public msg: MessageService,
        public formBuilder: FormBuilder,
        public authService: AuthService,
        public alertController: AlertController,
        private modalController: ModalController,
        public loadingController: LoadingController
    ) { 
        this.cadastroForm = formBuilder.group({
            nome_completo: [
                '', 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(5)
                ])
            ],
            nome_social: [
                '', 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(5)
                ])
            ],
            // grauinstrucao: [
            //     '', 
            //     Validators.compose([
            //         Validators.required
            //     ])
            // ],
            email: [
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            cpf: [
                '', 
                Validators.compose([
                    Validators.required, 
                    CPFValidator.isValid
                ])
            ],
            // endereco: [
            //     '', 
            //     Validators.compose([
            //         Validators.required
            //     ])
            // ],
            // numero: [
            //     '', 
            //     Validators.compose([
            //         Validators.required
            //     ])
            // ],
            // cidade: [
            //     '', 
            //     Validators.compose([
            //         Validators.required
            //     ])
            // ],
            // uf: [
            //     '', 
            //     Validators.compose([
            //         Validators.required,
            //         Validators.minLength(2),
            //         Validators.maxLength(2)
            //     ])
            // ],
            password1: [
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            password2: [
                '', 
                Validators.compose([
                    Validators.required
                ])
            ]
        });

        this.msgErrors = { 
            nome_completo: 'Tem algo errado com seu nome completo.',
            nome_social: 'Tem algo errado com seu nome social.',
            // grauinstrucao: 'Informe o seu grau de instrução.',
            email: 'Tem algo errado com seu e-mail.',
            cpf: 'Tem algo errado com seu CPF.',    
            // endereco: 'Tem algo errado com seu endereço.',
            // numero: 'Tem algo errado com o número.',
            // cidade: 'Tem algo errado com a sua cidade.',
            // uf: 'Tem algo errado com o UF.',
            password1: 'Tem algo errado com a sua senha.',
            password2: 'Tem algo errado com a confirmação da senha.'
        };
    }

    ngOnInit() {}

    salvar() {
        this.submitForm = true;

        if(this.cadastroForm.valid){

            if(this.cadastroForm.value.cpf){
                this.cadastroForm.value.cpf = this.removeSpecialCharacter(this.cadastroForm.value.cpf);
            }

            if(this.cadastroForm.value.password1 != this.cadastroForm.value.password2){
                let message = 'A nova senha e a confirmação estão diferentes.';
                this.presentAlertMessage(message);
                return false;
            }

            let cadastroFormData = this.cadastroForm.value;
            // console.log(cadastroFormData);
            // console.log('PODE SALVAR!!!');

            this.presentLoading().then(
                (loading:any)=> {
                    // this.loginRemoto(loading);

                    this.authService.cadastro(cadastroFormData).then(
                        (data:any) => {
                            loading.dismiss();
                            // console.log('CADASTRO-RESULT-DATA: '+ JSON.stringify(data));
                            this.msg.show('Cadastro realizado com sucesso.');
                            this.closeModal();
                        },
                        (err) => {
                            loading.dismiss();
                            // console.log('ERRO-CADASTRO-RESULT-DATA: '+ JSON.stringify(err));
                            this.messageErrorsInput(err.error);
                        }
                    );
                }
            );
        }
    }

    messageErrorsInput(errors){
        let me = this;
        let errorsObject = JSON.parse(errors);
        Object.keys(errorsObject).forEach(function(key) {
            me.cadastroForm.controls[key].setErrors({'incorrect': true});
            me.msgErrors[key] = errorsObject[key];
        });
    }

    removeSpecialCharacter(string){
        return string.replace(/[^\d]+/g,'');
    }

    async presentAlertMessage(message) {
        const alert = await this.alertController.create({
            header: 'Atenção!',
            message: '<center>'+message+'</center>',
            buttons: [
                {
                    text: 'ok'
                }
            ]
        });

        await alert.present();
    }

    async closeModal() {
        const onClosedData: string = "Wrapped Up!";
        await this.modalController.dismiss(onClosedData);
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
          message: 'Cadastrando...'
        });

        await loading.present();

        return loading;
    }

}
