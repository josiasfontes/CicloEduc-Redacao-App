import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HTTP } from '@ionic-native/http/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//SERVICES
import { ApiService } from  './providers/api.service';
import { DataService } from  './providers/data.service';
import { AuthService } from  './providers/auth.service';
import { MessageService } from  './providers/message.service';
import { PagseguroPgtoService } from  './providers/pagseguro-pgto-service';

//MODALS
import { ChatbotmodalPageModule } from '../app/chatbotmodal/chatbotmodal.module';
import { UpdateModalPageModule } from '../app/perfil/update-modal/update-modal.module';
import { CadastroModalPageModule } from '../app/login/cadastro-modal/cadastro-modal.module';
import { PagamentoModalPageModule } from '../app/perfil/pagamento-modal/pagamento-modal.module';
import { UpdateFotoModalPageModule } from '../app/perfil/update-foto-modal/update-foto-modal.module';
import { UpdateSenhaModalPageModule } from '../app/perfil/update-senha-modal/update-senha-modal.module';
import { UpdatePlanoModalPageModule } from '../app/perfil/update-plano-modal/update-plano-modal.module';
import { PagamentoCartaoModalPageModule } from '../app/perfil/pagamento-modal/pagamento-cartao-modal/pagamento-cartao-modal.module';
import { PagamentoBoletoModalPageModule } from '../app/perfil/pagamento-modal/pagamento-boleto-modal/pagamento-boleto-modal.module';

import { PerfilDAO } from  './perfil/perfil.dao';
import { PerfilService } from  './perfil/perfil.service';

import { DAO } from  './providers/dao/dao';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { PipesModule } from './pipes/pipes.module';

import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';


@NgModule({
	declarations: [
		AppComponent
	],

	entryComponents: [],
	
	imports: [
		BrowserModule, 
	 	FormsModule,
    	ReactiveFormsModule,
		IonicModule.forRoot(),
		IonicStorageModule.forRoot(),
		AppRoutingModule,
		CadastroModalPageModule,
		PagamentoModalPageModule,
		ChatbotmodalPageModule,
		UpdateModalPageModule,
		UpdateFotoModalPageModule,
		UpdateSenhaModalPageModule,
		UpdatePlanoModalPageModule,
		PagamentoCartaoModalPageModule,
		PagamentoBoletoModalPageModule,
		PipesModule
	],
	
	providers: [
		DatePipe,
		Crop,
		FileTransfer, 
		File,
		ImagePicker,
		HTTP,
		Toast,
		SQLite,
		StatusBar,
		SplashScreen,
		InAppBrowser,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		ApiService,
		AuthService,
		DataService,
		MessageService,
		PagseguroPgtoService,
		PerfilService,
		DAO,
		PerfilDAO
	],
	
	bootstrap: [
		AppComponent
	]
})

export class AppModule {}
