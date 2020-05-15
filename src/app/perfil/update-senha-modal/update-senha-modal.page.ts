import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../perfil.service';
import { MessageService } from  '../../providers/message.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-update-senha-modal',
	templateUrl: './update-senha-modal.page.html',
	styleUrls: ['./update-senha-modal.page.scss'],
})

export class UpdateSenhaModalPage implements OnInit {

	updateSenhaForm: FormGroup;
	msgErrors:any = {};
	submitForm = false;

	constructor(
        public msg: MessageService,
		public formBuilder: FormBuilder,
        public perfilService: PerfilService,
		public alertController: AlertController,
		private modalController: ModalController,
        public loadingController: LoadingController
	) { 
	
		this.updateSenhaForm = formBuilder.group({
            senha_atual: [
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            nova_senha1: ['', 
                Validators.compose([
                    Validators.required
                ])
            ],
            nova_senha2: ['',
                Validators.compose([
                    Validators.required
                ])
            ]
        });

        this.msgErrors = { 
            senha_atual: 'Informe a senha atual.',
            nova_senha1: 'Informe a nova senha.',
            nova_senha2: 'Confirme a nova senha.'
        };
	}

  	ngOnInit() {}

  	updateSenha() {
        this.submitForm = true;


        if(this.updateSenhaForm.valid){

	        if(this.updateSenhaForm.value.nova_senha1 != this.updateSenhaForm.value.nova_senha2){
	        	let message = 'A nova senha e a confirmação estão diferentes.';
	        	this.presentAlertSenhas(message);
	        	return false;
	        }
	        else if(this.updateSenhaForm.value.nova_senha1 == this.updateSenhaForm.value.senha_atual){
	        	let message = 'A nova senha é igual a senha atual.';
	        	this.presentAlertSenhas(message);
	        	return false;
	        }

        	let updateSenhaFormData = this.updateSenhaForm.value;

            this.presentLoading().then(
                (loading:any)=> {
                    this.perfilService.updateSenhaRemote(updateSenhaFormData).then(
                        (data:any) => {
                            loading.dismiss();
                            this.msg.show('Senha alterada com sucesso.');
                            this.closeModal();
                        },
                        (err) => {
                            loading.dismiss();
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
            me.updateSenhaForm.controls[key].setErrors({'incorrect': true});
            me.msgErrors[key] = errorsObject[key];
        });
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
          message: 'Alterando senha...'
        });

        await loading.present();

        return loading;
    }

    async presentAlertSenhas(message) {
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

}
