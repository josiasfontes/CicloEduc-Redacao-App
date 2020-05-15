import { DAO } from '../providers/dao/dao';
import {Injectable} from '@angular/core';
 
@Injectable({
    providedIn: 'root'
})

export class PerfilDAO {
 
    constructor(
        public dao: DAO
    ) {}

    list() {
        return new Promise((resolve, reject) => {
            this.dao.getDB().then((storage) => {
                let sql = `SELECT * FROM aluno`;
                storage.executeSql(sql, []).then((data) => {
                    let aluno = {};
                    if(data.rows.length > 0) {
                        for(let i = 0; i < data.rows.length; i++) {
                            aluno = {
                                id: data.rows.item(i).id, 
                                nome_completo: data.rows.item(i).nome_completo,
                                nome_social: data.rows.item(i).nome_social,
                                email: data.rows.item(i).email,
                                cpf: data.rows.item(i).cpf,
                                grauinstrucao: data.rows.item(i).grauinstrucao,
                                foto: data.rows.item(i).foto,
                                endereco: data.rows.item(i).endereco,
                                numero: data.rows.item(i).numero,
                                cidade: data.rows.item(i).cidade,
                                uf: data.rows.item(i).uf
                            };
                        }
                    }
                    // console.log('ALUNO-LIST-DAO: '+ JSON.stringify(aluno));
                    resolve(aluno);
                }, (error) => {
                    reject(error);
                });
            });
        });
    }

    create(data) {
        return new Promise((resolve, reject) => {
            
            this.dao.getDB().then((storage) => {
                let sql = `
                    INSERT INTO aluno 
                    (nome_completo,
                    nome_social,
                    email,
                    cpf,
                    grauinstrucao,
                    foto,
                    endereco,
                    numero,
                    cidade,
                    uf)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                storage.executeSql(sql, [
                    data.nome_completo,
                    data.nome_social,
                    data.email,
                    data.cpf,
                    data.grauinstrucao,
                    data.foto,
                    data.endereco,
                    data.numero,
                    data.cidade,
                    data.uf
                ]).then(
                    (data) => resolve(data),
                    error => reject(error)
                );
            });
        });
    }

    update(dados) {
        return new Promise((resolve, reject) => {
            this.dao.getDB().then((storage) => {
                let sql = `
                    UPDATE aluno SET 
                    nome_completo = ?,
                    nome_social = ?,
                    email = ?,
                    cpf = ?,
                    grauinstrucao = ?,
                    foto = ?,
                    endereco = ?,
                    numero = ?,
                    cidade = ?,
                    uf = ?
                    WHERE id = 1
                `;
                storage.executeSql(sql, [
                    dados.nome_completo,
                    dados.nome_social,
                    dados.email,
                    dados.cpf,
                    dados.grauinstrucao,
                    dados.foto,
                    dados.endereco,
                    dados.numero,
                    dados.cidade,
                    dados.uf
                ]).then(
                    (data) => resolve(data),
                    error => reject(error)
                );
            });
        });
    } 


}


