import { Observable } from 'rxjs';
import { Events } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { AuthService } from './auth.service';
import { HTTP } from '@ionic-native/http/ngx';
import { MessageService } from  './message.service';
import { JwtHelperService } from "@auth0/angular-jwt";

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

    private timeoutRequest = null;
    private token:string;

	constructor(
        private http: HTTP,
        private events: Events,
        private msg: MessageService,
        public authService: AuthService,
        private dataService: DataService) { 

        this.timeoutRequest = this.dataService.getTimeoutRequests();
    }

    prepareRequest(url: string) {

        return new Promise((resolve, reject) => {
            this.dataService.getTokenAccess().then((token) => {
                if(token){
                    this.checkTokenExpired(token).then((tokenRefreshed) => {
                        if(tokenRefreshed){
                            this.token = token;
                            resolve( this.dataService.getApiUrl(url) );
                        }
                        else {
                            this.events.publish('user:tokenExpired');
                            reject(false);
                        }
                    });
                }
            });
        });
    }

    checkTokenExpired(tokenParam){
        return new Promise((resolve) => {
            let jwtHelper = new JwtHelperService();
            let tokenExpired = jwtHelper.isTokenExpired(tokenParam);

            // let expirationDate = jwtHelper.getTokenExpirationDate(tokenParam);
            // console.log('TOKEN-EXPIRED: '+ tokenExpired);
            // console.log(JSON.stringify(expirationDate));
            
            if(tokenExpired){
                this.refreshToken().then(
                    (ok) => {
                        resolve(true);
                    },
                    (err) => {
                        resolve(false);
                    }
                );
            }
            else{
                resolve(true);
            }
        });
    }

    refreshToken() {
        return new Promise((resolve, reject) => {
            this.dataService.getTokenRefresh().then((tokenRefresh) => {
                if(tokenRefresh){
                    let urlRefreshToken = this.dataService.getApiUrl('refresh/');
                    this.http.setRequestTimeout(this.timeoutRequest);
                    this.http.post(urlRefreshToken, { refresh: tokenRefresh }, {})
                    .then(data => {
                        let refreshTokenObject = JSON.parse(data.data);
                        if(refreshTokenObject && refreshTokenObject.access) {
                            this.dataService.setTokenAccess(refreshTokenObject.access);
                            resolve(true);
                        }
                        resolve(false);
                    })
                    .catch(error => {
                        console.log(JSON.stringify(error));
                        // this.resultError(error);
                        reject(error);
                    });
                }
            });
        });
    }

    resultError(error) {
        return new Promise((resolve, reject) => {
            if(error.status == -3) { //NAO CONECTADO
                let message = 'Falha de conexão com a internet.';
                this.msg.show(message);
                reject();
            }
            else if(error.status == -4) { //ERRO TIME-OUT
                let message = 'Problemas ao conectar com o servidor';
                this.msg.show(message);
                reject();
            }
            else if(error.status == 401) { //UNAUTHORIZED
                let message = 'Falha de conexão com o servidor.';
                this.msg.show(message);
                reject();
            }
        });
    }

	get(url: string, dados?:any ) {

        return new Promise((resolve, reject) => {
            // let options:any = {};
            // let data = null;

            this.prepareRequest(url)
                .then((url:string) => {

                    this.http.setRequestTimeout(this.timeoutRequest);

                    this.http.get(url, {}, { Authorization: 'Bearer '+this.token })
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        console.log('ERRO-GET: '+ JSON.stringify(error));
                        this.resultError(error);
                        reject(error);
                    });

                }).catch(error => {
                    console.log('ERRO-PREPARE-REQUEST: '+ JSON.stringify(error));
                    this.resultError(error);
                    reject(error);
                }
            );
        }); 
    }

    post(url: string, dados: any) {
        return new Promise((resolve, reject) => {
            
        });
    }

    put(url: string, dados: any) {
        
        return new Promise((resolve, reject) => {

            this.prepareRequest(url)
                .then((url:string) => {

                    this.http.setRequestTimeout(this.timeoutRequest);

                    this.http.put(url, dados, { Authorization: 'Bearer '+this.token }).then(
                        (result) => {
                            resolve(result);
                        },
                        (err) => {
                            reject(err)
                        }
                    );

                }).catch(error => {
                    console.log('ERRO-PREPARE-REQUEST: '+ JSON.stringify(error));
                    this.resultError(error);
                    reject(error);
                }
            );
        });
    }

    delete(url: string, dados?:any) {

        return new Promise((resolve, reject) => {

             this.prepareRequest(url)
                .then((url:string) => {

                    this.http.setRequestTimeout(this.timeoutRequest);

                    this.http.delete(url, dados, { Authorization: 'Bearer '+this.token }).then(
                        (result) => {
                            resolve(result);
                        },
                        (err) => {
                            reject(err)
                        }
                    );

                }).catch(error => {
                    console.log('ERRO-PREPARE-REQUEST: '+ JSON.stringify(error));
                    this.resultError(error);
                    reject(error);
                }
            );
        
        });
    }


  
}
