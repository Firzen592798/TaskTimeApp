import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import { Camera,  SQLite, Base64ToGallery } from 'ionic-native'; 

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
    console.log("tentando inserir");
    this.database.executeSql("insert into tarefa (nome, tempo) values('"+this.txtTarefa+"', 0)", []).then((data) => {
      console.log("inserido com sucesso: " +this.txtTarefa);
      console.log(data);
      Base64ToGallery.base64ToGallery(this.imageData, 'img_').then(
        res => console.log('Saved image to gallery ', res),
        err => console.log('Error saving image to gallery ', err)
      );
      this.showAlert();
    }, (error) => {
      console.log(error);
    });
    //this.refreshData();
    this.txtTarefa = "";
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      subTitle: 'Tarefa cadastrada com sucesso!',
      buttons: ['OK']
    });
    alert.present();
  }

  openCamera(){
    let options = {
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      allowEdit: true, 
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
