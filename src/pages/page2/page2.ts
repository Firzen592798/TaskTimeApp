import { Component } from '@angular/core';

import { SQLite } from 'ionic-native';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})

export class Page2 {
  database: SQLite;
  selectedItem: any;
  icons: string[];
  items: Array<{id: number, nome: string, tempo: number, icon: string, play: boolean, tempoString: string}>;


  refreshData(){
    this.items = [];
    this.database.executeSql("select * from tarefa", []).then((data) => {
       console.log(data);
      if(data.rows.length > 0){
        for(var i = 0; i < data.rows.length; i++){
          this.items.push({
            id: data.rows.item(i).id,
            nome: data.rows.item(i).nome,
            tempo: data.rows.item(i).tempo,
            tempoString: this.formataTempo(data.rows.item(i).tempo),
            icon: 'paper-plane',
            play: false
          });
        }
      } 
    }, (error) => {
      console.log(error);
    });
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.database = new SQLite();
    this.database.openDatabase({name: "tasktime.db", location: "default"}).then(() => {
    this.items = [];
    console.log("Items1 = "+this.items);
    this.refreshData();
    //console.log("Items Refresh = "+this.items);
    console.log("Items antes timer = "+this.items);
    
    setInterval(() => this.timer(this.items), 1000);

    console.log('Items timer '+this.items);
    }, (error) => {
      console.log("Erro ao listar");
    });  
    
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];
  }

  timer(items: any){
    console.log("Dentro timer "+items);
    for(var i = 0; i < items.length; i++){
      if(items[i].play){
        items[i].tempo += 1;
        items[i].tempoString = this.formataTempo(items[i].tempo);
      }
      //this.items[i].tempo += 1;
      console.log(items[i]);
    }
  }

  formataTempo(elapsed)
  {
    var ss = elapsed % 60;
    elapsed  = (elapsed - ss) / 60;
    var min = elapsed % 60;
    elapsed = (elapsed - min) / 60;
    console.log(elapsed)
    var hh = elapsed % 24;
    console.log(hh)
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
    //this.navCtrl.push(Page2, {
      //item: item
   // });
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
}
