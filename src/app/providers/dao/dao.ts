import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class DAO {

    private storage: SQLiteObject;
    private isOpen: boolean;
    private conn: Promise<any>;
    private dbName = 'database-1.0.db'; // NÃO ALTERAR NOME DO BANCO
    
    public constructor(
        private platform: Platform, 
        private sqlite: SQLite
    ) {}


    openConnection() {
        if(!this.isOpen) {
            this.conn = new Promise((resolve) => {
                this.platform.ready().then(() => {
                    this.sqlite.create({
                        name: this.dbName, 
                        location: "default"
                    }).then(
                        (db: SQLiteObject) => {
                            this.isOpen = true;
                            this.storage = db;

                            // db.executeSql('create table danceMoves(name VARCHAR(32))', [])
                            // .then(() => console.log('Executed SQL'))
                            // .catch(e => console.log(e));

                            db.executeSql(`

                                CREATE TABLE IF NOT EXISTS aluno (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    nome_completo VARCHAR(150),
                                    nome_social VARCHAR(100),
                                    email VARCHAR(100),
                                    cpf VARCHAR(100),
                                    grauinstrucao VARCHAR(50),
                                    foto VARCHAR(250),
                                    endereco VARCHAR(150),
                                    numero INTEGER,
                                    cidade VARCHAR(50),
                                    uf VARCHAR(2)
                                );

                            `, [])
                            .then(() => null/*console.log('TABELA ALUNO CRIADA...')*/)
                            .catch(e => console.log(JSON.stringify(e)));

                            // db.executeSql(`

                            //     INSERT INTO aluno 
                            //         (nome_completo, apelido_plataforma, cpf, email, endereco_completo, grauinstrucao) 
                            //         VALUES ('Jose da Silva', 'jose', 12345678909, 'jose@email.com', 'rua de teste, nº 10,', 'Ensino Medio')
                            //     ;

                            // `, [])
                            // .then(() => console.log('REGISTRO INSERIDO EM ALUNO...'))
                            // .catch(e => console.log(JSON.stringify(e)));


                            // db.executeSql(`

                            //     SELECT * FROM aluno

                            // `, [])
                            // .then((data) => {
                            //     if(data.rows.length > 0) {
                            //         for(let i = 0; i < data.rows.length; i++) {
                            //             console.log(JSON.stringify(data.rows.item(i)));
                            //         }
                            //     }
                            // })
                            // .catch(e => console.log(JSON.stringify(e)));

                            resolve(this.storage);
                        },
                        (err) => {
                            console.log('ERRO_CREATE_DB '+ err);
                        }
                    )
                    .catch(e => console.log(e));
                });
            });
        }
    }

    getDB(): Promise<any> {
        return this.conn;
    }

}