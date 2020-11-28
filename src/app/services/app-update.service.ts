import { Injectable } from "@angular/core";
import { Deploy } from "cordova-plugin-ionic/dist/ngx";
import { AlertController, LoadingController, Platform } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class AppUpdateService {
  constructor(
    private deploy: Deploy,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private platform: Platform
  ) {}

  async __checkAppUpdates() {
    if (!this.platform.is("cordova")) {
      return;
    }
    const update = await this.deploy.checkForUpdate();
    if (update.available) {
      await this.__presentUpdateDownloadPopup();
    }
  }

  async __presentUpdateDownloadPopup() {
    const alert = await this.alertCtrl.create({
      cssClass: "my-custom-class",
      header: "Updates Available!",
      message: "There is a new version of the app available. Please update now.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Update",
          handler: async () => {
            let loading = await this.loadingCtrl.create({
              spinner: "crescent",
              message: "The app is being updated. Please wait...",
            });
            await loading.present();
            await this.deploy.downloadUpdate((progress) => {
              console.log(progress);
            });
            await this.deploy.extractUpdate((progress) => {
              console.log(progress);
            });
            await loading.dismiss();
            await this.showAwaitableAlert(
              "Updated!",
              "The app has been updated to the latest version."
            );
            await this.deploy.reloadApp();
          },
        },
      ],
    });

    await alert.present();
  }

  public async showAwaitableAlert(title, subTitle, message = "") {
    return await new Promise(async (accept, reject) => {
      let alert = await this.alertCtrl.create({
        header: title,
        subHeader: subTitle,
        message,
        buttons: [
          {
            text: "Ok",
            handler: () => {
              alert.dismiss().then(() => accept());
              return false;
            },
          },
        ],
      });
      await alert.present();
    });
  }
}
