import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import {apis, constants} from "../../../../common/shared";
import {Settings} from "../../../model/Settings";
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage extends BasePage implements OnInit {
  settings: Settings = {
    par_level_update: true,
    restaurant_id: 0
  };
  org: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    // private cameraService: CameraService
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this._enableRestaurantMenu();
  }
  async ionViewDidLoad() {
    this.org = await this.storage.get(constants.STORAGE_ORGANIZATION);
    let res = await this.callApi(apis.API_GET_USER_SETTINGS,  {'restaurant_id': this.org.restaurant_id}, {shouldBlockUi: true});
    console.log(res);
    if (res.data.settings) {
      this.settings = res.data.settings;
      await this.storage.set(constants.USER_SETTINGS, res.data.settings);
    } else {
      await this.storage.set(constants.USER_SETTINGS, this.settings);
    }
  }

  async addOrUpdateSettings() {
    console.log(this.settings);
    this.settings.restaurant_id = this.org.restaurant_id;
    let res = await this.callApi(apis.API_ADD_OR_UPDATE_SETTINGS, this.settings, {shouldBlockUi: false});
    if (!res.success) return;
    await this.storage.set(constants.USER_SETTINGS, this.settings);
  }

  repDeliveryMethodEditTapped() {
    //TODO - Fix
    // this.navCtrl.push('RepDeliveryMethodPage');
  }
}
