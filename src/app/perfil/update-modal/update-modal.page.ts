import { PerfilService } from '../perfil.service';
import { Component, OnInit, Input } from '@angular/core';
import { CPFValidator } from '../../../validators/cpf.validator';
import { MessageService } from  '../../providers/message.service';
import { DateValidator } from '../../../validators/date.validator';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Platform, ModalController, AlertController, LoadingController, NavParams } from '@ionic/angular';

@Component({
	selector: 'app-update-modal',
	templateUrl: './update-modal.page.html',
	styleUrls: ['./update-modal.page.scss'],
})

export class UpdateModalPage implements OnInit {

    @Input() aluno: any;

	updateForm: FormGroup;
	msgErrors:any = {};
	submitForm = false;

	constructor(
        navParams: NavParams,
        public msg: MessageService,
		public formBuilder: FormBuilder,
        public perfilService: PerfilService,
		public alertController: AlertController,
		private modalController: ModalController,
        public loadingController: LoadingController
	) { 

        this.aluno = navParams.get('aluno');

		this.updateForm = formBuilder.group({
            nome_completo: [
                this.aluno.nome_completo, 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(5)
                ])
            ],
            nome_social: [
                this.aluno.nome_social, 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(5)
                ])
            ],
            email: [
                this.aluno.email, 
                Validators.compose([
                    Validators.required
                ])
            ],
            grauinstrucao: [
                this.aluno.grauinstrucao, 
                Validators.compose([
                    Validators.required
                ])
            ],
            endereco: [
                this.aluno.endereco, 
                Validators.compose([
                    Validators.required
                ])
            ],
            numero: [
                this.aluno.numero, 
                Validators.compose([
                    Validators.required
                ])
            ],
            cidade: [
                this.aluno.cidade, 
                Validators.compose([
                    Validators.required
                ])
            ],
            uf: [
                this.aluno.uf, 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(2)
                ])
            ]
        });

        this.msgErrors = { 
            nome_completo: 'Tem algo errado com seu nome completo.',
            nome_social: 'Tem algo errado com seu nome social.',
            email: 'Tem algo errado com seu e-mail.',
            grauinstrucao: 'Informe o seu grau de instrução.',
            endereco: 'Tem algo errado com seu endereço.',
            numero: 'Tem algo errado com o número.',
            cidade: 'Tem algo errado com a sua cidade.',
            uf: 'Tem algo errado com o UF.'
        };
	}

	ngOnInit() {}

    updateChangeValueUf(value) {
        this.updateForm.controls['uf'].setValue(value.toUpperCase());
    } 

	salvar() {
        this.submitForm = true;

        if(this.updateForm.valid){

            let updateFormData = this.updateForm.value;

            // console.log(JSON.stringify(updateFormData));
            
            this.presentLoading().then(
                (loading:any)=> {
                    this.perfilService.updateDataRemote(updateFormData).then(
                        (data:any) => {
                            loading.dismiss();
                            // console.log('UPDATE-RESULT-DATA: '+ JSON.stringify(data));
                            this.msg.show('Dados atualizados com sucesso.');
                            this.closeModal('refresh_data_aluno');
                        },
                        (err) => {
                            loading.dismiss();
                            console.log('ERRO-UPDATE-RESULT-DATA: '+ JSON.stringify(err));
                            
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
            me.updateForm.controls[key].setErrors({'incorrect': true});
            me.msgErrors[key] = errorsObject[key];
        });
    }

    async closeModal(onClosedData) {
        // const onClosedData: string = "Wrapped Up!";
        await this.modalController.dismiss(onClosedData);
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
          message: 'Salvando...'
        });

        await loading.present();

        return loading;
    }

}
