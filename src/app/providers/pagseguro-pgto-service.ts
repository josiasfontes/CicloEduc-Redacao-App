import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from './data.service';
import { HTTP } from '@ionic-native/http/ngx';
import { VarGlobalProvider } from './var-global';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { MessageService } from './message.service';

declare var PagSeguroDirectPayment: any;

@Injectable({
    providedIn: 'root'
})

export class PagseguroPgtoService {
    
    public credencial: Credencial;
    // public dados = new Dados();

    constructor(
        private http: HTTP,
        private datepipe: DatePipe,
        public msg: MessageService, 
        private dataService: DataService,
        private varGlobais: VarGlobalProvider,
        private ngxXml2jsonService: NgxXml2jsonService
    ) {
    }

    iniciar(email, token, isSandBox) { 

        return new Promise((resolve, reject) => {
            
            this.credencial = new Credencial();

            if (isSandBox) {
                this.credencial.urlSession = "https://ws.sandbox.pagseguro.uol.com.br/v2/sessions?email=" + email + "&token=" + token;
                this.credencial.urlPagSeguroDirectPayment = "https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
                this.credencial.urlAderirPlano = "https://ws.sandbox.pagseguro.uol.com.br/pre-approvals?email="+email+"&token="+token;
            } else {
                this.credencial.urlSession = "https://ws.pagseguro.uol.com.br/v2/sessions?email=" + email + "&token=" + token;
                this.credencial.urlPagSeguroDirectPayment = "https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
                this.credencial.urlAderirPlano = "https://ws.pagseguro.uol.com.br/pre-approvals?email="+email+"&token="+token;
            }

            this.credencial.key = this.datepipe.transform(new Date(), "ddMMyyyyHHmmss");
            this.credencial.email = email;
            this.credencial.token = token;
            this.credencial.isSandBox = isSandBox;

            if (!this.varGlobais.getStatusScript()) {
                this.getSession(email, token).then((data) => {
                    this.carregaPagSeguroDirectPayment().then(() => {
                        PagSeguroDirectPayment.setSessionId(this.credencial.idSession);
                        resolve(data);
                    });
                }).catch(error => {
                    console.log('ERRO: '+ JSON.stringify(error));
                    reject(error);
                });
            }
        });
    }

    // CARREGA O JAVASCRIPT DO PAGSEGURO PARA NOSSA VARIÁVEL 
    carregaPagSeguroDirectPayment() {  
        return new Promise((resolve) => {
            let script: HTMLScriptElement = document.createElement('script');
            script.addEventListener('load', r => resolve());
            script.src = this.credencial.urlPagSeguroDirectPayment;
            document.head.appendChild(script);
        });
    }

    createCardToken(dadosCartaoForm) { 
        let me = this;
        return new Promise((resolve, reject) => {
            let mesValidadeCard = dadosCartaoForm.validade.substring(0,2);
            let anoValidadeCard = dadosCartaoForm.validade.substring(3,7);

            //CRIA O HASK DO CARTÃO DE CRÉDITO JUNTO A API DO PAGSEGURO
            PagSeguroDirectPayment.createCardToken({
          
                cardNumber: dadosCartaoForm.numero_cartao,
                cvv: dadosCartaoForm.cod_seguranca,
                expirationMonth: mesValidadeCard,
                expirationYear: anoValidadeCard,
                brand: dadosCartaoForm.bandeira_cartao,
                
                success: function(response:any) {
                    // me.tokenCartao = response.card.token;
                    resolve(response.card.token);
                },
                error: function(response) {
                    console.log('ERROR: '+ JSON.stringify(response));
                    reject(response);
                }
            });
        });
    }

    getHashComprador(){
        let me = this;
        return new Promise((resolve, reject) => {
            //ANTIGO
            // let hashComprador = PagSeguroDirectPayment.getSenderHash();
            PagSeguroDirectPayment.onSenderHashReady(function(response){
                if(response.status == 'error') {
                    reject(response.message);
                    // return false;
                }
                resolve(response.senderHash);
            });
        });

    }

    getBandeiraCartao(numeroCartao){
        let numero_cartao = numeroCartao.replace(/ /g,"");
        return new Promise((resolve, reject) => {
            if(numero_cartao.length < 6){
                reject();
            }
            let me = this;
            let cartaoBin = numero_cartao.substring(0,6);
            PagSeguroDirectPayment.getBrand({
                cardBin: cartaoBin,
                success: function(response:any) {
                    // me.bandeiraCartao = response.brand.name;
                    resolve(response.brand.name);
                },
                error: function(response) {
                    reject(response);
                }
            });
        });
    }

    private getSession(email, token) { 
        return new Promise((resolve, reject) => {
            this.http.post(this.credencial.urlSession, {}, {}).then(
                (dataSession) => {
                    const parser = new DOMParser();
                    var xml = parser.parseFromString(dataSession.data, 'text/xml');
                    var obj:any = this.ngxXml2jsonService.xmlToJson(xml);
                    // console.log(obj.session.id); // will get the data as json
                    this.credencial.idSession = obj.session.id;
                    resolve(dataSession);
                },
                (err) => {
                    console.log('ERRO-GET-SESSION: '+ JSON.stringify(err));
                    // this.msg.show('Falha ao carregar dados do PAGSEGURO.');
                    reject(err);
                }
            );
        });
    }

    // pagarComCartao(dadosPagamento){
    //     return new Promise((resolve, reject) => {
    //         this.http.setDataSerializer('json');
    //         this.http.put('assinaturas/pagar/cartao-de-credito', dadosPagamento , {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/vnd.pagseguro.com.br.v1+json;charset=ISO-8859-1'
    //         }).then(
    //             (data) => {
    //                 resolve(data);
    //             },
    //             (err) => {
    //                 // console.log('ERRO: '+ JSON.stringify(err));
    //                 reject(err)
    //             }
    //         );
    //     });
    // }


    // aderirPlano(dadosAderir){
    //     return new Promise((resolve, reject) => {
    //         this.http.setDataSerializer('json');
    //         this.http.post(this.credencial.urlAderirPlano, dadosAderir , {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/vnd.pagseguro.com.br.v1+json;charset=ISO-8859-1'
    //         }).then(
    //             (data) => {
    //                 resolve(data);
    //             },
    //             (err) => {
    //                 // console.log('ERRO: '+ JSON.stringify(err));
    //                 reject(err)
    //             }
    //         );
    //     });
    // }

    // cancelarAdesaoAssinatura(){
    //     let me = this;
    //     let email = this.dataService.getEmailPagseguro();
    //     let token = this.dataService.getTokenPagseguro();
    //     let codeAdesaoAssinatura = null;
    //     let urlCancelarAdesao = "https://ws.sandbox.pagseguro.uol.com.br/pre-approvals/"+codeAdesaoAssinatura+"/cancel?email="+email+"&token="+token;

    //     return new Promise((resolve, reject) => {
    //         this.http.setDataSerializer('json');
    //         this.http.put(urlCancelarAdesao, {} , {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1'
    //         }).then(
    //             (data) => {
    //                 resolve(data);
    //             },
    //             (err) => {
    //                 // console.log('ERRO: '+ JSON.stringify(err));
    //                 reject(err)
    //             }
    //         );
    //     });
    // }

    // gerarBoletoPagSeguro(dadosBoleto){
    //     let email = this.dataService.getEmailPagseguro();
    //     let token = '2eb95acf-ebd9-4ba3-af88-5ca44bf931d9d20d56434ae393bbd28671e4ae89429b7c10-2f20-4ee4-b255-a70fb3c2e367';
    //     let urlGerarBoleto = 'https://ws.pagseguro.uol.com.br/recurring-payment/boletos?email='+email+'&token='+token;
    //     return new Promise((resolve, reject) => {
    //         this.http.setDataSerializer('json');
    //         this.http.post(urlGerarBoleto, dadosBoleto , {
    //             'Content-Type': 'application/json;charset=ISO-8859-1',
    //             'Accept': 'application/json;charset=ISO-8859-1'
    //         }).then(
    //             (data) => {
    //                 console.log('DATA: '+ JSON.stringify(data));
    //                 resolve(data);
    //             },
    //             (err) => {
    //                 console.log('ERRO: '+ JSON.stringify(err));
    //                 reject(err)
    //             }
    //         );
    //     });
    // }

}

// CLASSE PARA ARMAZENAR NOSSOS DADOS DE ACESSO A CONTA DO PAGSEGURO
export class Credencial {
    key: string;
    urlSession: string;
    urlPagSeguroDirectPayment: string;
    urlAderirPlano: string;
    // urlTransacao: string;
    idSession: string;
    email: string;
    token: string;
    isSandBox: boolean;
}