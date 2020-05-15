import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../perfil.service';
import { ApiService } from '../../../providers/api.service';
import { DataService } from '../../../providers/data.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CPFValidator } from '../../../../validators/cpf.validator';
import { MessageService } from  '../../../providers/message.service';
import { PagseguroPgtoService } from '../../../providers/pagseguro-pgto-service';

@Component({
	selector: 'app-pagamento-cartao-modal',
	templateUrl: './pagamento-cartao-modal.page.html',
	styleUrls: ['./pagamento-cartao-modal.page.scss'],
})

export class PagamentoCartaoModalPage implements OnInit {

    public nome_aluno: string; 
    public email_aluno: string; 
    public email_vendedor:string;
    public token_vendedor:string;
    public hash_comprador: any;
    public plan_code:string;
    public plan_reference:string;
    public msgErrors:any = {};
    public isSandBox:boolean;
    public submitCartaoForm:boolean = false;

	pagamentoCartaoForm: FormGroup;

	constructor(
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

        this.iniciarConfigPagamento();
        // this.getPlanMinhaAssinatura();
        this.getDataAlunoLocal();

        this.pagamentoCartaoForm = formBuilder.group({
            numero_cartao: [
                // '4111111111111111', 
                '', 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(19),
                    Validators.maxLength(19)
                ])
            ],
            validade: [
                // '12/2030', 
                '', 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(7),
                    Validators.maxLength(7)
                ])
            ],
            cod_seguranca: [
                // '123', 
                '', 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(3)
                ])
            ],
            nome_cartao: [
                // 'NOME COMPRADOR', 
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            data_nascimento: [
                // '01/01/1990', 
                '', 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(10)
                ])
            ],
            cpf_titular: [
                // '123.456.789-09', 
                '', 
                Validators.compose([
                    Validators.required, 
                    CPFValidator.isValid
                ])
            ],
            telefone: [
                // '(84) 991452021', 
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            logradouro: [
                // 'Rua de Teste', 
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            numero: [
                // '15', 
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            complemento: [
                // 'Casa', 
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            bairro: [
                // 'Centro', 
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            cidade: [
                // 'Jose da Penha', 
                '', 
                Validators.compose([
                    Validators.required
                ])
            ],
            uf: [
                // 'RN', 
                '', 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(2)
                ])
            ],
            cep: [
                // '59.980-000', 
                '', 
                Validators.compose([
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(10)
                ])
            ],
        });

        this.msgErrors = { 
            numero_cartao: 'Tem algo errado com o número do cartão.',
            validade: 'Tem algo errado com a validade do cartão.',
            cod_seguranca: 'Informe o código de segurança do cartão.',
            nome_cartao: 'Tem algo errado com o nome que está no cartão.',
            data_nascimento: 'Informe corretamente a data de nascimento do titular do cartão.',
            cpf_titular: 'Tem algo errado com o CPF.',    
            telefone: 'Tem algo errado com o número do telefone.',
            logradouro: 'Informe o logradouro.',
            numero: 'Tem algo errado com o número.',
            complemento: 'Tem algo errado com o complemento.',
            bairro: 'Tem algo errado com o bairro.',
            cidade: 'Tem algo errado com a cidade.',
            uf: 'Tem algo errado com o UF.',
            cep: 'Tem algo errado com o cep.'
        };
	}

	ngOnInit() {} 

    updateChangeValueUf(value) {
        this.pagamentoCartaoForm.controls['uf'].setValue(value.toUpperCase());
    }

    getDataAlunoLocal(){
        this.perfilService.listAluno().then(
            (alunoLocal:any) => {
                this.nome_aluno = alunoLocal.nome_completo;
                // this.email_aluno = (this.isSandBox) ? 'c13392376636162816408@sandbox.pagseguro.com.br' : alunoLocal.email;
            },
            (err) => {
                console.log('ERRO-LIST-ALUNO-LOCAL: '+ JSON.stringify(err));
            }
        );
    }

    // getPlanMinhaAssinatura(){
    //     this.apiService.get('assinaturas/pagar/pagseguro/').then(
    //         (result:any) => {
    //             if(this.isSandBox){
    //                 this.plan_code = "AB8ADB61B9B981F224A38FAB6CB631A5";
    //                 this.plan_reference = "REF5";
    //             }
    //             else{
    //                 let resultDataObject = JSON.parse(result.data);
    //                 this.plan_code = resultDataObject.plan;
    //                 this.plan_reference = resultDataObject.reference;
    //             }
    //         },
    //         (error) => { 
    //             this.msg.show('Falha ao carregar plano da sua assinatura.');
    //             console.log('ERRO-GET-PLAN: '+JSON.stringify(error));
    //         }
    //     );
    // }

    salvar() {

        let me = this;
        this.submitCartaoForm = true;

        if(this.pagamentoCartaoForm.valid){
            let pagamentoFormData:any = Object.assign({}, this.pagamentoCartaoForm.value);

            // if(this.plan_code.length == 0){
            //     this.msg.show('Sistema indisponível no momento. Tente novamente mais tarde.');
            //     return false;
            // }

            // pagamentoFormData.plan = this.plan_code;
            // pagamentoFormData.reference = this.plan_reference;

            this.presentLoading().then(
                (loading:any)=> {

                    this.getBandeiraCartao(pagamentoFormData.numero_cartao).then((brandCard) => {

                        pagamentoFormData.bandeira_cartao = brandCard;

                        // this.getHashComprador();

                        this.pagseg.getHashComprador().then((hashComprador) => {
            
                            // console.log('HASH-COMPRADOR: '+ JSON.stringify(hashComprador));
                            me.hash_comprador = hashComprador;


                            this.pagseg.createCardToken(pagamentoFormData).then((cardToken:any) => {
                                loading.dismiss();
                            
                                pagamentoFormData.token_cartao = cardToken;

                                if(cardToken){
                                    let dadosPagarCartao = this.setDadosSubmitPagamento(pagamentoFormData);

                                    // console.log(JSON.stringify(dadosPagarCartao));
                                    
                                    this.pagarCartao(dadosPagarCartao);
                                }
                                else{
                                    this.msg.show('Não possível processar os dados do cartão.');
                                }

                            }).catch(error => {
                                loading.dismiss();
                                this.msg.show('Falha ao criptografar dados do cartão de crédito.');
                                console.log('FALHA CARD TOKEN:'+JSON.stringify(error));
                            });

                        }).catch(error => {
                            loading.dismiss();
                            console.log('FALHA-HASH-COMPRADOR: '+ JSON.stringify(error));
                            this.msg.show('Falha ao identificar o comprador.');
                        });
                        
                    }).catch(error => {
                        loading.dismiss()
                        this.msg.show('Falha ao identificar bandeira do cartão de crédito.');
                        console.log('FALHA GET BANDEIRA:'+JSON.stringify(error));
                    });
                }
            );
        }
    }

    iniciarConfigPagamento(){

        this.pagseg.iniciar(this.email_vendedor, this.token_vendedor, this.isSandBox).then((data) => {
            // console.log('INIT-CONFIG-PAGAMENTO: '+ JSON.stringify(data));
        }).catch(error => {
            this.msg.show('Sistema indisponível no momento. Tente mais tarde!');
            console.log('ERRO-INIT-CONFIG-PAGAMENTO: '+ JSON.stringify(error));
        });
    }

    getBandeiraCartao(numeroCartao){
        let me = this;
        return new Promise((resolve, reject) => {
            this.pagseg.getBandeiraCartao(numeroCartao).then((bandeiraCartao) => {
                // me.bandeira_cartao = bandeiraCartao;
                resolve(bandeiraCartao);
            }).catch(error => {
                reject(error);
            });
        });
    }

    createCardToken(pagamentoFormData){
        let me = this;
        return new Promise((resolve, reject) => {
            if(this.pagseg.credencial.idSession){
                this.pagseg.createCardToken(pagamentoFormData).then((cardToken:any) => {
                    // me.tokenCartao = cardToken;
                    resolve(cardToken);
                }).catch(error => {
                    reject(error);
                });
            }
            else {
                reject();
            }
        });
    }

    pagarCartao(pagamentoFormData){
        this.presentLoading('Salvando assinatura..').then(
            (loading:any)=> {

                this.apiService.put('assinaturas/pagar/cartao-de-credito', pagamentoFormData
                ).then(
                    (data:any) => {
                        loading.dismiss();
                        // console.log('DATA-PAGAR-CARTAO: '+ JSON.stringify(data));
                        this.msg.show('Pagamento processado com sucesso.');
                        this.closeModal('refresh_data_assinatura');
                    },
                    (errors) => {
                        loading.dismiss();
                        console.log('ERRO-PAGAR-CARTAO: '+ JSON.stringify(errors));

                        let messageError = 'Falha processar pagamento com cartão.';
                        let errorObject = JSON.parse(errors.error);
                        if(Object.values(errorObject).length > 0){
                            messageError += ' ERRO: '+Object.values(errorObject)[0];
                        }
                        this.msg.show(messageError);
                    }
                );

                // this.pagseg.aderirPlano(pagamentoFormData).then((data:any) => {
                //     loading.dismiss();
                //     // console.log('DATA-ADEDIR-PLANO: '+ JSON.stringify(data));
                //     this.msg.show('Plano aderido com sucesso.');
                //     this.closeModal('refresh_data_assinatura');
                // }).catch(errors => {
                //     loading.dismiss();
                //     let messageError = 'Falha ao aderir ao plano.';
                //     let errorObject = JSON.parse(errors.error);
                //     if(Object.values(errorObject.errors).length > 0){
                //         messageError += ' ERRO: '+Object.values(errorObject.errors)[0];
                //     }
                //     this.msg.show(messageError);
                // });
            }
        );
    }


    setDadosSubmitPagamento(pagamentoFormData){

        let dados = {
            "sender_hash": this.hash_comprador,
            "token": pagamentoFormData.token_cartao,
            "name": this.nome_aluno,
            "birth_date": pagamentoFormData.data_nascimento,
            "cpf": pagamentoFormData.cpf_titular.replace(/[^0-9]/g,''),
            "area_code": pagamentoFormData.telefone.replace(/[^0-9]/g,'').substring(0,2), 
            "phone": pagamentoFormData.telefone.replace(/[^0-9]/g,'').substring(2,),
            "street": pagamentoFormData.logradouro,
            "number": pagamentoFormData.numero,
            "complement": pagamentoFormData.complemento,
            "district": pagamentoFormData.uf,
            "city": pagamentoFormData.cidade,
            "state": pagamentoFormData.uf,
            // "postalCode": pagamentoFormData.cep.replace(/[^0-9]/g,'')
            "postalCode": pagamentoFormData.cep.replace(/\./g, '')
        };

        return dados;

        // let dados = {
        //     "plan": pagamentoFormData.plan,
        //     "reference": pagamentoFormData.reference,
        //     "sender": {
        //         "name": this.nome_aluno,
        //         "email": this.email_aluno,
        //         "hash": this.hash_comprador,
        //         "phone": {
        //             "areaCode": pagamentoFormData.telefone.replace(/[^0-9]/g,'').substring(0,2), 
        //             "number": pagamentoFormData.telefone.replace(/[^0-9]/g,'').substring(2,)
        //         },
        //         "address": {
        //             "street": pagamentoFormData.logradouro,
        //             "number": pagamentoFormData.numero,
        //             "complement": pagamentoFormData.complemento,
        //             "district": pagamentoFormData.uf,
        //             "city": pagamentoFormData.cidade,
        //             "state": pagamentoFormData.uf,
        //             "country": "BRA",
        //             "postalCode": pagamentoFormData.cep.replace(/[^0-9]/g,'')
        //         },
        //         "documents": [{
        //             "type": "CPF",
        //             "value": pagamentoFormData.cpf_titular.replace(/[^0-9]/g,'')
        //         }]
        //     },
        //     "paymentMethod": {
        //         "type": "CREDITCARD",
        //         "creditCard": {
        //             "token": pagamentoFormData.token_cartao,
        //             "holder": {
        //                 "name": pagamentoFormData.nome_cartao,
        //                 "birthDate": pagamentoFormData.data_nascimento,
        //                 "documents": [{
        //                     "type": "CPF",
        //                     "value": pagamentoFormData.cpf_titular.replace(/[^0-9]/g,'')
        //                 }],
        //                 "phone": {
        //                     "areaCode": pagamentoFormData.telefone.replace(/[^0-9]/g,'').substring(0,2), 
        //                     "number": pagamentoFormData.telefone.replace(/[^0-9]/g,'').substring(2,)
        //                 },
        //                 "billingAddress": {
        //                     "street": pagamentoFormData.logradouro,
        //                     "number": pagamentoFormData.numero,
        //                     "complement": pagamentoFormData.complemento,
        //                     "district": pagamentoFormData.uf,
        //                     "city": pagamentoFormData.cidade,
        //                     "state": pagamentoFormData.uf,
        //                     "country": "BRA",
        //                     "postalCode": pagamentoFormData.cep.replace(/[^0-9]/g,'')
        //                 }
        //             }
        //         }
        //     }
        // };
        // return dados;
    }

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
