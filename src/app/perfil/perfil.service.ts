import { PerfilDAO } from './perfil.dao';
import { Injectable } from '@angular/core';
import { ApiService } from '../providers/api.service';
import { DataService } from '../providers/data.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Injectable({
    providedIn: 'root'
})

export class PerfilService {
    
    constructor(
        private perfilDAO: PerfilDAO,
        private apiService: ApiService,
        private transfer: FileTransfer,
        private dataService: DataService
    ) {}

    listAlunoRemote() {
        return new Promise((resolve, reject) => {
            this.apiService.get('comum/perfil/').then(
                (result:any) => {
                    resolve(result);
                },
                (error) => { reject(error); }
            );
        });
    }

    updateDataRemote(dados){
        return new Promise((resolve, reject) => {
            this.apiService.put('comum/perfil/', dados).then(
                (data) => {
                    resolve(data);
                },
                (err) => reject(err)
            );
        });
    }

    updateSenhaRemote(dados){
        return new Promise((resolve, reject) => {
            this.apiService.put('comum/alterar-senha/', dados).then(
                (data) => {
                    resolve(data);
                },
                (err) => reject(err)
            );
        });
    }

    updateFileRemote(image, params){
        return new Promise((resolve, reject) => {
            this.dataService.getTokenAccess().then((token) => {
                
                const fileTransfer: FileTransferObject = this.transfer.create();

                let options: FileUploadOptions = {
                    fileKey: 'foto',
                    fileName: 'imagedevice.jpg',
                    mimeType: "image/jpeg",
                    httpMethod: 'PUT',
                    chunkedMode: false,
                    params: params
                }

                var headers = { 'Authorization': 'Bearer ' + token };
                options.headers = headers;

                var url = this.dataService.getApiUrl('comum/perfil/');

                fileTransfer.upload(image.path, encodeURI(url), options).then(
                    (data:any) => {
                        resolve(image)
                    }, 
                    (err) => {
                        reject(err);
                    }
                );
            });
        });
    }

    cancelarAssinaturaRemote(){
        return new Promise((resolve, reject) => {
            this.apiService.delete('assinaturas/assinatura').then(
                (data) => {
                    resolve(data);
                },
                (err) => reject(err)
            );
        });
    }

    listAluno() {
        return this.perfilDAO.list();
    }

    create(dados){
        return this.perfilDAO.create(dados);
    }

    update(dados){
        return this.perfilDAO.update(dados);
    }

    clearDataPerfil(){
        let dados = {
            nome_completo: null,
            nome_social: null,
            email: null,
            cpf: null,
            grauinstrucao: null,
            foto: null,
            endereco: null,
            numero: null,
            cidade: null,
            uf: null
        };
        return this.perfilDAO.update(dados);
    }




}