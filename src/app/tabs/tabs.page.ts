import { Component } from '@angular/core';
import { ModalController, Events } from '@ionic/angular';
import { MessageService } from  '../providers/message.service';
import { ChatbotmodalPage } from '../chatbotmodal/chatbotmodal.page';
import { CadastroModalPage } from '../login/cadastro-modal/cadastro-modal.page';

@Component({
	selector: 'app-tabs',
	templateUrl: 'tabs.page.html',
	styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    assinatura: any;
    // hiddenTabBar: boolean;

	constructor(
        public events: Events,
        public msg: MessageService,
        public modalController: ModalController
    ) {
        // this.hiddenTabBar = true;
        let me = this;
        this.events.subscribe('user:assinaturaSituacao', (assinaturaEvent:any) => {
            // me.hiddenTabBar = (assinaturaEvent.status == 1) ? false : true;
            me.assinatura = assinaturaEvent
        });
    }

    async openModalChatBot() {

        if(this.assinatura.status != 1){
            this.msg.show('A sua assinatura não está ativa.');
            return false;
        }

        const modal = await this.modalController.create({
            component: ChatbotmodalPage
        });

        return await modal.present();
    }
}
