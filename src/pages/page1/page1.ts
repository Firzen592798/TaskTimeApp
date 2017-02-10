import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { SQLite } from 'ionic-native'; 

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  database: SQLite;
  txtTarefa: string;

  constructor(public navCtrl: NavController) {
    this.database = new SQLite();
    this.database.openDatabase({name: "tasktime.db", location: "default"}).then(() => {
    }, (error) => {
    });  
  }

  salvar() : void{
    console.log("tentando inserir");
    this.database.executeSql("insert into tarefa (nome, tempo) values('"+this.txtTarefa+"', 0)", []).then((data) => {
      console.log("inserido com sucesso: " +this.txtTarefa);
      console.log(data);
    }, (error) => {
      console.log(error);
    });
    //this.refreshData();
    this.txtTarefa = "";
  }
}
