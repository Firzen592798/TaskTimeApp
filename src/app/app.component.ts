import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
      this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Cadastrar Tarefa', component: Page1 },
      { title: 'Listar Tarefas', component: Page2 },

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {      
        this.nav.setRoot(Page1);
      StatusBar.styleDefault();
      Splashscreen.hide();
      let db = new SQLite();
      db.openDatabase({
        name: "tasktime.db", 
        location: "default"
      }).then(() => {
          db.executeSql("CREATE TABLE IF NOT EXISTS tarefa (id integer primary key autoincrement, nome TEXT, tempo INTEGER)", {}).then((data)=> {
            console.log("tabela criada", data);
          }, (error) => {
            console.error("erro na criação da tabela", error);
          })
          db.executeSql("delete from tarefa)", {}).then(()=> {
          })
      },(error) => {
         console.error("erro na criação da tabela", error);
      });     
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
