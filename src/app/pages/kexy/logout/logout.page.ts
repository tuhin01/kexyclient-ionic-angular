import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { routeConstants } from 'src/common/routeConstants';
import { apis } from 'src/common/shared';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage extends BasePage implements OnInit {

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this._logout();
  }
  async _logout() {
    // await this.kFire.afAuth.auth.signOut(); // causes issues
    let token = await this.storage.get('__LOCAL_DEVICE_ID_FOR_LOGOUT');
    console.log({ token });
    if (token) {
      let res = await this.callApi(apis.API_USER_LOGOUT, {
        device_id: token
      }, { shouldBlockUi: true });
    }
    await this.removeLocalUserData();
    this.setRoot(routeConstants.HOME);
  }
}
