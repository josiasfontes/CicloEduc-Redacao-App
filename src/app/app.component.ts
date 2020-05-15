import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { DAO } from './providers/dao/dao';
import { ApiService } from './providers/api.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from './providers/auth.service';
import { DataService } from './providers/data.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { MessageService } from  './providers/message.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})

export class AppComponent {
    constructor(
        private dao: DAO,
        public events: Events,
        private route: Router,
        private platform: Platform,
        public msg: MessageService,
        private statusBar: StatusBar,
        private apiService: ApiService,
        public authService: AuthService,
        private dataService: DataService,
        private splashScreen: SplashScreen,
        public loadingController: LoadingController
        // private screenOrientation: ScreenOrientation
    ) {
        
        this.events.subscribe('user:tokenExpired', () => {
            this.resetDataTokenExpired();
        });

        this.initializeApp();

        this.presentLoading().then(
            (loading:any)=> {
                this.getToken().then((tokenRefreshed) => {
                    
                    if(tokenRefreshed == null){
                        this.splashScreen.hide();
                    }
                    else if(tokenRefreshed == true){
                        this.route.navigate(['/start']);
                    }
                    else if(tokenRefreshed == false){
                        this.resetDataTokenExpired();
                    }

                    loading.dismiss();
                });
            }
        );
    }

    resetDataTokenExpired(){
        let message = 'O acesso expirou. Faça login novamente!';
        this.msg.show(message);
        this.dataService.removeTokenAccess();
        this.dataService.removeTokenRefresh();
        this.dataService.removeCredentials();
        this.route.navigate(['/login']);
    }

    initializeApp() {
        this.platform.ready().then(() => {

            this.platform.backButton.observers.pop(); //DESATIVA BACKBUTTON

            // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
            // this.statusBar.styleDefault();
            this.statusBar.backgroundColorByName("white");
            this.statusBar.styleDefault();
            
            // this.splashScreen.hide();
            
            this.dao.openConnection();
            // this.getToken();

            this.refreshAuthomaticTokenAccess();
        });
    }

    getToken(){
        return new Promise((resolve) => {
            this.dataService.getTokenAccess().then(
                (token) => {
                    // console.log('TOKEN-ACCESS: '+ JSON.stringify(token));

                    if (token == null) {
                        resolve(null);
                    }
                    else {
                        this.checkTokenExpired(token).then((tokenRefreshed) => {
                            if(tokenRefreshed){
                                resolve(true);
                            }
                            else {
                                resolve(false);
                            }
                        });
                    }
                }
            );
        });
    }

    checkTokenExpired(tokenParam){
        return new Promise((resolve) => {
            let jwtHelper = new JwtHelperService();
            let tokenExpired = jwtHelper.isTokenExpired(tokenParam);
            // let expirationDate = jwtHelper.getTokenExpirationDate(tokenParam);
            // console.log(JSON.stringify(tokenExpired));
            // console.log(JSON.stringify(expirationDate));

            if(tokenExpired){
                this.dataService.getCredentials().then(
                    (credentials) => {
                        if(credentials){
                            this.authService.login(credentials).then(
                                (data:any) => {
                                    // console.log('REFRESH-TOKEN-LOGIN: '+ JSON.stringify(data));
                                    resolve(true);
                                    
                                },
                                (err) => {
                                    // console.log('ERR-REFRESH-TOKEN-LOGIN: '+ JSON.stringify(err));
                                    resolve(false);
                                }
                            );
                        }
                        else{
                            resolve(false);
                        }
                    }
                );
            }
            else{
                resolve(true);
            }
        });
    }

    refreshAuthomaticTokenAccess(){
        setInterval(() => {

            this.dataService.getCredentials().then(
                (credentials) => {
                    if(credentials){
                        this.authService.login(credentials).then(
                            (data:any) => {
                                // console.log('REFRESH-TOKEN-LOGIN: '+ JSON.stringify(data));
                                
                            },
                            (err) => {
                                // console.log('ERR-REFRESH-TOKEN-LOGIN: '+ JSON.stringify(err));
                            }
                        );
                    }
                }
            );

        }, 240000); //4 min.
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
          message: 'Caregando...'
        });

        await loading.present();

        return loading;
    }

}
