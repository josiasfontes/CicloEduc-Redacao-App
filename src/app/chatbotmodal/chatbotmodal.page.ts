import { ModalController } from '@ionic/angular';
import { DataService } from '../providers/data.service';
import { DomSanitizer} from '@angular/platform-browser';
import { IonContent, Events, LoadingController } from '@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
	selector: 'app-chatbotmodal',
	templateUrl: './chatbotmodal.page.html',
	styleUrls: ['./chatbotmodal.page.scss'],
})

export class ChatbotmodalPage implements OnInit {

	private botFrameworkId:string;
	private loaded: any;
	public urlBotFramework:any;
	private tokenAccessUser:string;
	
	constructor(
		// private iab: InAppBrowser,
		private sanitizer: DomSanitizer,
		private dataService: DataService,
		private modalController: ModalController,
		public loadingController: LoadingController
	) {

		let URL = 'https://cicloeduc.com.br/chatbot/resposta/chat?t=';

  		this.dataService.getTokenAccess().then((tokenAccessUser) => {
			this.urlBotFramework = this.sanitizer.bypassSecurityTrustResourceUrl(URL+tokenAccessUser);
			// console.log(this.urlBotFramework);
		});
				
	}

  	ngOnInit() {
  		let me = this;
  		

  		this.presentLoading().then(
            (loading:any)=> {
            	me.loaded = loading;
            }
        );
  	}

  	async presentLoading() {
        const loading = await this.loadingController.create({
          message: 'Carregando...',
          backdropDismiss: true
        });

        await loading.present();

        return loading;
    }

	async closeModal() {
		this.loaded.dismiss();
	    const onClosedData: string = "Wrapped Up!";
	    await this.modalController.dismiss(onClosedData);
	}

	onLoad(){
		this.loaded.dismiss();
	}

}
