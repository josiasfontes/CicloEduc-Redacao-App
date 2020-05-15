import { HTTP } from '@ionic-native/http/ngx';
import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../perfil.service';
import { ApiService } from '../../../providers/api.service';
import { DataService } from '../../../providers/data.service';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CPFValidator } from '../../../../validators/cpf.validator';
import { MessageService } from  '../../../providers/message.service';
import { PagseguroPgtoService } from '../../../providers/pagseguro-pgto-service';

@Component({
  selector: 'app-pagamento-boleto-modal',
  templateUrl: './pagamento-boleto-modal.page.html',
  styleUrls: ['./pagamento-boleto-modal.page.scss'],
})
export class PagamentoBoletoModalPage implements OnInit {

	pagamentoBoletoForm: FormGroup;
    msgErrors:any = {};
    submitBoletoForm:boolean = false;
    // planCode:string = '';
    planReference:string = '';
    isSandBox:boolean;
    nomeAluno: string; 
    emailAluno: string;
    hash_comprador: any;
    email_vendedor:string;
    token_vendedor:string;
    boletos = [];
    buttonDisabled:boolean = true;

  	constructor(
  		private http: HTTP,
        // private iab: InAppBrowser,
		public msg: MessageService,
        private apiService: ApiService,
        public formBuilder: FormBuilder,
        private dataService: DataService,
        public perfilService: PerfilService,
        private pagseg: PagseguroPgtoService,
		private modalController: ModalController,
		public loadingController: LoadingController
	) { 

        this.isSandBox = this.dataService.getIsSandBox();
        this.email_vendedor = this.dataService.getEmailPagseguro();
        this.token_vendedor = this.dataService.getTokenPagseguro();

        // this.gerarBoleto();

        this.iniciarConfigPagamento();


        /*
  		this.isSandBox = this.dataService.getIsSandBox();

  		this.getPlanMinhaAssinatura();
  		this.getDataAlunoLocal();

        */

  		 this.pagamentoBoletoForm = formBuilder.group({
            /*cpf_titular: [
                '123.456.789-09', 
                Validators.compose([
                    Validators.required, 
                    CPFValidator.isValid
                ])
            ],
            */
            telefone: [
                // '(84) 991452021', 
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            /*
            logradouro: [
                'Rua de Teste', 
                Validators.compose([
                    Validators.required
                ])
            ],
            numero: [
                '15', 
                Validators.compose([
                    Validators.required
                ])
            ],
            complemento: [
                'Casa', 
                Validators.compose([
                    Validators.required
                ])
            ],
            bairro: [
                'Centro', 
                Validators.compose([
                    Validators.required
                ])
            ],
            cidade: [
                'Jose da Penha', 
                Validators.compose([
                    Validators.required
                ])
            ],
            uf: [
                'RN', 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(2)
                ])
            ],
            cep: [
                '59.980-000', 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(10)
                ])
            ],
            */
        });

        /**/
        this.msgErrors = { 
            telefone: 'Tem algo errado com o número do telefone.',
            /*cpf_titular: 'Tem algo errado com o CPF.',    
            logradouro: 'Informe o logradouro.',
            numero: 'Tem algo errado com o número.',
            complemento: 'Tem algo errado com o complemento.',
            bairro: 'Tem algo errado com o bairro.',
            cidade: 'Tem algo errado com a cidade.',
            uf: 'Tem algo errado com o UF.',
            cep: 'Tem algo errado com o cep.'*/
        };

	}

	ngOnInit() {
	}

    iniciarConfigPagamento(){
        let me = this;
        this.pagseg.iniciar(this.email_vendedor, this.token_vendedor, this.isSandBox).then((data) => {
            // console.log('INIT-CONFIG-PAGAMENTO: '+ JSON.stringify(data));
            me.getHashComprador();
        }).catch(error => {
            this.msg.show('Sistema indisponível no momento. Tente mais tarde!');
            console.log('ERRO-INIT-CONFIG-PAGAMENTO: '+ JSON.stringify(error));
        });
    }

    getHashComprador(){
        let me = this;
        this.pagseg.getHashComprador().then((hashComprador) => {
            
            // console.log('HASH-COMPRADOR: '+ JSON.stringify(hashComprador));

            me.hash_comprador = hashComprador;
            me.buttonDisabled = false;

            // me.gerarBoleto();

        }).catch(error => {
            console.log('FALHA-HASH-COMPRADOR: '+ JSON.stringify(error));
            this.msg.show('Falha ao identificar o comprador.');
        });
    }

    gerarBoleto(){

        this.submitBoletoForm = true;

        if(this.pagamentoBoletoForm.valid){
            let pagamentoFormData:any = Object.assign({}, this.pagamentoBoletoForm.value);

            let codigoArea = pagamentoFormData.telefone.replace(/[^0-9]/g,'').substring(0,2);
            let numeroTelefone = pagamentoFormData.telefone.replace(/[^0-9]/g,'').substring(2,);

            this.presentLoading().then(
                (loading:any)=> {

                    this.apiService.put('assinaturas/pagar/boleto', {
                        sender_hash: this.hash_comprador,
                        area_code: codigoArea,
                        phone: numeroTelefone
                    }).then(
                        (data) => {
                            loading.dismiss();
                            // console.log('DATA:'+JSON.stringify(data));

                            this.closeModal('refresh_data_assinatura');
                            // this.getDataAssinaturaRemote(loading);
                        },
                        (err) => {
                            loading.dismiss();
                            this.msg.show('Não foi possível gerar o boleto bancário.');
                            console.log('ERRO:'+JSON.stringify(err));
                        }
                    );
                }
            );

        }
    }

    /*
    abrirBoleto(link){
        const browser = this.iab.create(link, '_blank');
    }

	gerarBoleto(){

		this.submitBoletoForm = true;

        if(this.pagamentoBoletoForm.valid){
            let pagamentoFormData:any = Object.assign({}, this.pagamentoBoletoForm.value);

            if(this.planReference.length == 0){
                this.msg.show('Não foi possível carregar a referência da assinatura. Tente mais tarde.');
                return false;
            }

            // pagamentoFormData.plan = this.planCode;
            pagamentoFormData.reference = this.planReference;
            pagamentoFormData.data_vencimento = this.setDataVencimentoBoleto();

            this.gerarBoletoRemote(pagamentoFormData);
        }

	}

	setDataVencimentoBoleto(){
		var someDate = new Date();
		var duration = 7; //In Days
		someDate.setTime(someDate.getTime() +  (duration * 24 * 60 * 60 * 1000));
		let diaVencimento = (someDate.getDate() < 10) ? ('0'+someDate.getDate()) : someDate.getDate();
		let mesVencimento = ((someDate.getMonth()+1) < 10) ? ('0'+(someDate.getMonth()+1)) : (someDate.getMonth()+1);
		let anoVencimento = someDate.getFullYear();
		let dataVencimentoString = anoVencimento+'-'+mesVencimento+'-'+diaVencimento;
		
		return dataVencimentoString;
	}

	gerarBoletoRemote(dadosBoletoParam){

		let dadosBoleto = {  
		   "periodicity": "monthly",
		   "reference": this.planReference,
		   "firstDueDate": dadosBoletoParam.data_vencimento,
		   "numberOfPayments": 1,
		   "amount": "0.00", //A DEFINIR
		   "description":"Pagamento CicloEduc Redação",
		   "customer":{  
		    	"document":{  
		        	"type":"CPF",
		        	"value": dadosBoletoParam.cpf_titular.replace(/[^0-9]/g,'')
		      	},
		      "name": this.nomeAluno,
		      "email": this.emailAluno,
		      "phone":{
		      		"areaCode": dadosBoletoParam.telefone.replace(/[^0-9]/g,'').substring(0,2), 
                    "number": dadosBoletoParam.telefone.replace(/[^0-9]/g,'').substring(2,)  
		      },
		      "address": {
		        	"postalCode": dadosBoletoParam.cep.replace(/[^0-9]/g,''),
		        	"street": dadosBoletoParam.logradouro,
		        	"number": dadosBoletoParam.numero,
		        	"district": dadosBoletoParam.uf,
		        	"city": dadosBoletoParam.cidade,
		        	"state": dadosBoletoParam.uf
		      }
		   }
		};

		this.presentLoading().then(
            (loading:any)=> {

            	this.pagseg.gerarBoletoPagSeguro(dadosBoleto).then((data:any) => {
                    loading.dismiss();
                    // console.log('DATA-ADEDIR-PLANO: '+ JSON.stringify(data));
                    this.msg.show('Boleto gerado com sucesso.');
                    this.closeModal('refresh_data_assinatura');
                }).catch(errors => {
                    loading.dismiss();
                    let messageError = 'Falha ao gerar o boleto.';
                    let errorObject = JSON.parse(errors.error);
                    if(Object.values(errorObject.errors).length > 0){
                        messageError += ' ERRO: '+Object.values(errorObject.errors)[0];
                    }
                    this.msg.show(messageError);
                });
            }
		);

	}
    

	getDataAlunoLocal(){
        this.perfilService.listAluno().then(
            (alunoLocal:any) => {
                this.nomeAluno = alunoLocal.nome_completo;
                this.emailAluno = alunoLocal.email;
            },
            (err) => {
                console.log('ERRO-LIST-ALUNO-LOCAL: '+ JSON.stringify(err));
            }
        );
    }

  	getPlanMinhaAssinatura(){
        this.apiService.get('assinaturas/pagar/pagseguro/').then(
            (result:any) => {
                if(this.isSandBox){
                    // this.planCode = "AB8ADB61B9B981F224A38FAB6CB631A5";
                    this.planReference = "REF5";
                }
                else{
                    let resultDataObject = JSON.parse(result.data);
                    // this.planCode = resultDataObject.plan;
                    this.planReference = resultDataObject.reference;
                }
            },
            (error) => { 
                console.log('ERRO-GET-PLAN: '+JSON.stringify(error));
            }
        );
    }

    */

    async presentLoading(msg?) {

        let messageLoading = (msg) ? msg : 'Carregando...';

        const loading = await this.loadingController.create({
            message: messageLoading//,
            // backdropDismiss: true
        });

        await loading.present();

        return loading;
    }

  	async closeModal(onClosedData) {
        await this.modalController.dismiss(onClosedData);
    }

}
