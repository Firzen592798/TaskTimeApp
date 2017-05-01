import { Component } from '@angular/core';

import { SQLite, BackgroundMode, File } from 'ionic-native';

import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})

export class Page2 {
  database: SQLite;
  selectedItem: any;
  icons: string[];
  items: Array<{id: number, nome: string, tempo: number,  play: boolean, tempoString: string, path: string, imagem: string}>;


  refreshData(){
    this.items = [];
    this.database.executeSql("select * from tarefa", []).then((data) => {
      if(data.rows.length > 0){
        for(var i = 0; i < data.rows.length; i++){
          this.items.push({
            id: data.rows.item(i).id,
            nome: data.rows.item(i).nome,
            tempo: data.rows.item(i).tempo,
            tempoString: this.formataTempo(data.rows.item(i).tempo),
            play: false,
            path: data.rows.item(i).path,
            imagem: ''
          });
          console.log("Setando imagem");
          this.setImagem(this.items[i]);
         console.log("imagem "+this.items[i]);
        }
      } 
    }, (error) => {
      console.log(error);
    });
    console.log(this.items);
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController) {
    // If we navigated to this page, we will have an item available as a nav param
    BackgroundMode.enable();
    this.database = new SQLite();
    this.database.openDatabase({name: "tasktime.db", location: "default"}).then(() => {
    this.items = [];
    this.refreshData();
    //console.log("Items Refresh = "+this.items);
    
    setInterval(() => this.timer(this.items), 1000);
    }, (error) => {
      console.log("Erro ao listar");
    });  
    
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];
  }

  timer(items: any){
    for(var i = 0; i < items.length; i++){
      if(items[i].play){
        items[i].tempo += 1;
        items[i].tempoString = this.formataTempo(items[i].tempo);
      }
      //this.items[i].tempo += 1;
    }
  }

  formataTempo(elapsed)
  {
    var ss = elapsed % 60;
    elapsed  = (elapsed - ss) / 60;
    var min = elapsed % 60;
    elapsed = (elapsed - min) / 60;
    var hh = elapsed % 24;
    return this.pad(hh) + ":" + this.pad(min) + ":" + this.pad(ss);
  }

  pad(num:number): string {
    var s = num+"";
    while (s.length < 2) s = "0" + s;
    return s;
  }

  itemTapped(event, item) {
    //this.navCtrl.push(Page2, {
      //item: item
   // });
  }

  play(event, item) {
    item.play = true;
    console.log(this.items);
  }

  stop(event, item) {
    item.play = false;
    this.database.executeSql("update tarefa set tempo = ? where id = ?", [item.tempo, item.id]).then((data) => {
       console.log("uploadado"); 
    }, (error) => {
      console.log(error);
    });
  }
  
  deletar(event, item){
      this.database.executeSql("delete from tarefa where id = ?", [item.id]).then((data) => {
       console.log("deletado"); 
    }, (error) => {
      console.log(error);
    });
    for(var i = 0; i < this.items.length; i++){
      if(this.items[i].id == item.id){
        this.items.splice(i, 1);
      }
    }
  }

  
  deletarDialog(event, item) {
    let confirm = this.alertCtrl.create({
      title: 'Aviso',
      message: 'Tem certeza que quer deletar essa tarefa?',
      buttons: [
        {
          text: 'Sim',
          icon: 'checkmark',
          handler: () => {
            this.deletar(event, item);
          }
        },
        {
          text: 'Não',
          icon: 'close',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  setImagem(item){
    console.log("ENTROU SET IMAGEM: Path = "+item.path);
    var path = item.path;
    var splited = path.split('/');
    splited[splited.length - 1];
    File.readAsDataURL('file:///'+path.replace("/"+splited[splited.length - 1], ""), splited[splited.length - 1]).then(function (base64Img) {
                  console.log(base64Img);
                  item.imagem = base64Img;
                  console.log("ITEM DEPOIS DE SET IMAGEM: "+item);
              })
              .catch(function (err: TypeError) {
                  console.log(err.message);
    });
  }
}
