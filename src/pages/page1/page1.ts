import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import { Camera,  SQLite, Base64ToGallery } from 'ionic-native'; 

import { Page2 } from '../page2/page2'

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  database: SQLite;
  txtTarefa: string;
  cameraData: string;
  imageData: string;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    this.database = new SQLite();
    this.database.openDatabase({name: "tasktime.db", location: "default"}).then(() => {
    }, (error) => {
    });  
  }

  salvar() : void{
    if(this.txtTarefa){
      var path: string;
      Base64ToGallery.base64ToGallery(this.imageData, 'img_').then(
          res => {
            path = res; 
            this.database.executeSql("insert into tarefa (nome, tempo, path) values('"+this.txtTarefa+"', 0, '"+path+"')", []).then((data) => {
            console.log("inserido com sucesso: " +this.txtTarefa);
            console.log("Inserido" + data);
            this.txtTarefa = "";
            this.imageData = "";
            this.cameraData = "";
            this.showAlert();
          }, (error) => {
            console.log(error);
          });
          },
          err => console.log('Erro ao salvar na galeria ', err)
      );
    }else{
        let alert = this.alertCtrl.create({
        title: 'Erro!',
        subTitle: 'É necessário preencher o nome da tarefa!',
        buttons: [{text: 'OK',
          handler: () => {
            
          }
        }]
      });
      alert.present();
    }
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      subTitle: 'Tarefa cadastrada com sucesso!',
      buttons: [{text: 'OK',
        handler: () => {
         this.navCtrl.push(Page2);
        }
      }]
    });
    alert.present();
  }

  openCamera(){
    let options = {
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      targetWidth: 192,
      targetHeight: 256,
      correctOrientation: true,
    };
    Camera.getPicture(options).then((imageData) => {
       this.cameraData = 'data:image/jpeg;base64,' + imageData;
       this.imageData = imageData;
       console.log(this.cameraData);
    }, (err) => {
      console.log("error");
    });
  }
 
}
