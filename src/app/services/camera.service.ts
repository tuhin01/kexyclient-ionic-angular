import { Injectable } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

@Injectable({
  providedIn: "root",
})
export class CameraService {
  public imageUrl: any = null;
  public newImageUploaded = false;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera
  ) {}

  async presentFileChooser() {
    this.newImageUploaded = false;
    this.imageUrl = null;
    return new Promise(async (resolve, reject) => {
      let buttons: any = [];
      buttons.push(
        {
          text: "Choose Photo",
          icon: "ios-folder-open-outline",
          handler: () => {
            this.takePicture("choose")
              .then((imageData) => {
                let imageUrl = "data:image/jpeg;base64," + imageData;
                resolve(imageUrl);
              })
              .catch((err) => {
                reject(err);
              }); // 0 == Library
          },
        },
        {
          text: "Take Photo",
          icon: "camera",
          handler: () => {
            this.takePicture("camera")
              .then((imageData) => {
                let imageUrl = "data:image/jpeg;base64," + imageData;
                resolve(imageUrl);
              })
              .catch((err) => {
                reject(err);
              }); // 1 == Camera
          },
        }
      );
      buttons.push({
        text: "Cancel",
        icon: "close",
        role: "cancel",
      });
      let actionSheet = await this.actionSheetCtrl.create({
        buttons: buttons,
      });
      await actionSheet.present();
    });
  }

  /**
   * Take picture using camera or gallery
   */
  public takePicture(source = "") {
    let options: CameraOptions = {};
    if (source == "choose") {
      options = {
        quality: 40,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        targetWidth: 300,
        targetHeight: 300,
        allowEdit: true,
        mediaType: 0,
        saveToPhotoAlbum: false,
        correctOrientation: true,
      };
    } else if (source == "camera") {
      options = {
        quality: 40,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 300,
        targetHeight: 300,
      };
    }

    return new Promise((resolve, reject) => {
      this.camera.getPicture(options).then(
        (imageData) => {
          resolve(imageData);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
