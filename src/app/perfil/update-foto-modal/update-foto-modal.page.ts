import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { PerfilService } from '../perfil.service';
import { Component, OnInit, Input } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { MessageService } from  '../../providers/message.service';
import { Platform, ModalController, LoadingController, NavParams } from '@ionic/angular';

@Component({
	selector: 'app-update-foto-modal',
	templateUrl: './update-foto-modal.page.html',
	styleUrls: ['./update-foto-modal.page.scss'],
})

export class UpdateFotoModalPage implements OnInit {

	@Input() aluno: any;
	
	croppedImagepath = "";
	image:any = {};

	constructor(
		private file: File,
		private crop: Crop,
		public msg: MessageService,
		private platform: Platform,
		private navParams: NavParams,
		private imagePicker: ImagePicker,
		public perfilService: PerfilService,
		private modalController: ModalController,
		public loadingController: LoadingController
	) { 
		this.aluno = navParams.get('aluno');
	}

	ngOnInit() {}

    takePicture() {
        this.imagePicker.getPictures({maximumImagesCount: 1}).then((results) => {
            for (var i = 0; i < results.length; i++) {
                this.cropImage(results[i]);	
                this.image = {
                    path: results[i]
                };
            }
        }, 
        (err) => { 
        	this.msg.show('Falha ao selecionar imagem.');
            console.log('ERRO IMAGE-PICKER: '+ JSON.stringify(err));
        });
    }

    cropImage(imgPath) {
		this.crop.crop(imgPath, { quality: 50 }).then((newPath) => {
			this.showCroppedImage(newPath.split('?')[0])
		},
		(error) => {
			this.msg.show('Falha ao carregar visualização da imagem.');
			console.log('ERROR CROPPING IMAGE: '+ JSON.stringify(error));
		});
	}
 
  showCroppedImage(ImagePath){
	    var copyPath = ImagePath;
	    var splitPath = copyPath.split('/');
	    var imageName = splitPath[splitPath.length-1];
	    var filePath = ImagePath.split(imageName)[0];
 
    	this.file.readAsDataURL(filePath,imageName).then((base64) => {
	        this.croppedImagepath = base64;
	    },
	    (error) => {
	    	console.log('ERROR IN SHOWING IMAGE: '+ JSON.stringify(error));
	    	this.msg.show('Falha ao visualizar imagem.');
	    });
	}

    saveRemote(){

    	this.presentLoading().then(
            (loading:any)=> {    

		    	if(!this.image.path){
		    		loading.dismiss();
    		        this.msg.show('Imagem não selecionada.');
		    		return false;
		    	}

		        let params = {
		            nome_completo: this.aluno.nome_completo
		        };

		        this.perfilService.updateFileRemote(this.image, params).then(
		            (imageResult:any) => {
		                // console.log('IMAGE-RESULT: '+JSON.stringify(imageResult));
		            	loading.dismiss();
		                this.msg.show('Foto alterada com sucesso.');
		                this.closeModal('refresh_data_aluno');
		            },
		            (err) => {
		            	loading.dismiss();
		                console.log('ERRO UPLOAD IMAGE: '+JSON.stringify(err));
		            }
		        );
            }
        );
    }

    async closeModal(onClosedData) {
        // const onClosedData: string = "Wrapped Up!";
        await this.modalController.dismiss(onClosedData);
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
          message: 'Enviando...'
        });

        await loading.present();

        return loading;
    }
}
