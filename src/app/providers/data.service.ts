import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class DataService {

    private apiUrl:string;
    private timeoutRequests:number;
    private botFrameworkId:string;
    private emailPagseguro:string;
    private tokenPagseguro:string;
    private isSandBox:boolean;

    constructor(public storage: Storage) {

        //local
        // this.apiUrl = 'https://homologacao.cicloeduc.com.br/api';
        this.apiUrl = 'https://cicloeduc.com.br/api';
        this.timeoutRequests = 30.0; //30 segundos
        this.botFrameworkId = '37M3aMB6zcU.kDwiHYWKaMwq18QJeUCHAdXXNo3fmMpWGvz9pXYig7E';
        
        this.emailPagseguro = 'plataformacicloeduc@gmail.com';
        this.tokenPagseguro = 'f98dd4c6-baf1-4b6c-8f07-0d070dd9440de91429e547588be2c4856e346208613478b1-c320-4ff7-b8d3-133e9e48cf21';
        this.isSandBox = false; //ESTA EM MODO DE DESENVOLVIMENTO
        
        // this.isSandBox = true; //ESTA EM MODO DE DESENVOLVIMENTO
        // this.emailPagseguro = 'josiasfontesjp@gmail.com';
        // this.tokenPagseguro = '64397293E902469BA71BED21FB55AA00'; //sandbox
    }


    public getTimeoutRequests() {
        return this.timeoutRequests;
    }

    public getApiUrl(url: string) {
        return this.apiUrl+'/'+url;
    }

    public getBotFrameworkId() {
        return this.botFrameworkId;
    }

    public getEmailPagseguro() {
        return this.emailPagseguro;
    }

    public getTokenPagseguro() {
        return this.tokenPagseguro;
    }

    public getIsSandBox() {
        return this.isSandBox;
    }

    public setLastLogin(lastLogin) {
        return this.storage.set( 'last_login', lastLogin );
    }

    public getLastLogin() {
        return this.storage.get('last_login');
    }

    public setTokenAccess(tokenAccess) {
        this.storage.set('token_access', tokenAccess);
    }

    public getTokenAccess() {
        return this.storage.get('token_access');
    }

    public removeTokenAccess() {
        return this.storage.remove('token_access');
    }

    public setTokenRefresh(tokenRefresh) {
        this.storage.set('token_refresh', tokenRefresh);
    }

    public getTokenRefresh() {
        return this.storage.get('token_refresh');
    }

    public removeTokenRefresh() {
        return this.storage.remove('token_refresh');
    }

    public setCredentials(credentials) {
        this.storage.set('credentials', credentials);
    }

    public getCredentials() {
        return this.storage.get('credentials');
    }

    public removeCredentials() {
        return this.storage.remove('credentials');
    }

    public setAssinatura(assinatura) {
        return this.storage.set('assinatura', assinatura);
    }

    public getAssinatura() {
        return this.storage.get('assinatura');
    }

}