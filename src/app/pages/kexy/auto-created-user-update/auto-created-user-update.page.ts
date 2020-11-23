import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
// import { CameraService } from 'src/app/services/camera.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { HomePage } from '../../home/home.page';
import {apis, constants} from '../../../../common/shared';
import { routeConstants } from 'src/common/routeConstants';

@Component({
  selector: 'app-auto-created-user-update',
  templateUrl: './auto-created-user-update.page.html',
  styleUrls: ['./auto-created-user-update.page.scss'],
})
export class AutoCreatedUserUpdatePage extends BasePage implements OnInit {
  primaryForm: FormGroup;
  private emailBackup = null;
  userInfo: any = {}; // TODO model
  private orgInfo: any = {}; // TODO model
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
    this.getUserData();

    this.primaryForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      current_password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ])),
      new_password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]))
    });
  }
  async getUserData(): Promise<any> {
    this.userInfo = await this.storage.get(constants.STORAGE_USER);
    this.orgInfo = await this.storage.get(constants.STORAGE_ORGANIZATION);

    this.emailBackup = this.userInfo.email;

    console.log(this.userInfo);
  }


  async primaryFormSubmitted(): Promise<any> {
    if (!this.primaryForm.valid) return;

    let passwordData: any = {};
    let form = this.primaryForm.value;


    // If email address is not changed then do not send it to server
    // if (form.email === this.emailBackup) {
    //   await this.showAwaitableAlert("Error!", "Type a new email address.");
    //   return;
    // }

    passwordData = {current_password: form.current_password, new_password: form.new_password};
    let resPass = await this.callApi(apis.API_USER_CHANGE_PASSWORD, passwordData);
    if (!resPass.success) {
      return;
    }

    let res = await this.callApi(apis.API_USER_CLAIM_ACCOUNT, {});
    if (!res.success) return;


    Object.assign(this.userInfo, res.data.user);
    console.log(this.userInfo);
    await this.storage.set(constants.STORAGE_USER, this.userInfo);
    await this.showAwaitableAlert("Success!", "Your info has been updated.");
    await this.setRoot(routeConstants.HOME);
  }
}
