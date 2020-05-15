import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private loginUrl: string;

    constructor(
        private http: HTTP,
        private dataService: DataService
    ) 
    {
        this.loginUrl = dataService.getApiUrl('token/');
    }

    authSuccess(tokenAccess, tokenRefresh, credentials) {
        this.dataService.setTokenAccess(tokenAccess);
        this.dataService.setTokenRefresh(tokenRefresh);
        this.dataService.setCredentials(credentials);
        // this.dataService.setUser(data.user);
    }

    login(credentials) {
        return new Promise((resolve, reject) => {
            this.http.post(this.loginUrl, credentials, {}).then(
                (result) => {
                    let dataObject = JSON.parse(result.data);
                    // console.log('RESULT-LOGIN-REMOTE: '+ JSON.stringify(dataObject));
                    this.authSuccess(dataObject.access, dataObject.refresh, credentials);
                    resolve(result);
                },
                (err) => {
                    reject(err)
                }
            );
        });
    }

    cadastro(dados){
        return new Promise((resolve, reject) => {

            let cadastroUrl = this.dataService.getApiUrl('comum/inscrever/');

            this.http.post(cadastroUrl, dados, {}).then(
                (result) => {

                    // console.log('CADASTRO-RESULT-DATA: '+ JSON.stringify(result));
                    
                    resolve(result);
                },
                (err) => {
                    // console.log('CADASTRO-ERR-DATA: '+ JSON.stringify(result));
                    reject(err)
                }
            );
        });
    }

    logout() {}

}