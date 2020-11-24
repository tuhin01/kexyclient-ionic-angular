import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { apis } from "../../../../common/shared";
import {routeConstants} from '../../../../common/routeConstants';

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.page.html",
  styleUrls: ["./forget-password.page.scss"],
})
export class ForgetPasswordPage extends BasePage implements OnInit {
  primaryForm;

  constructor(
    public navCtl: NavController,
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  async primaryFormSubmitted() {
    if (!this.primaryForm.valid) return;
    let res = await this.callApi(
      apis.API_USER_REQUEST_PASSWORD_RECOVERY_CODE,
      this.primaryForm.value
    );
    if (!res.success) return;
    await this.navigateTo(routeConstants.CANNABIS.PASSWORD_RESET, {email: this.primaryForm.value.email})
  }

  async loginNowTapped() {
    await this.navCtrl.pop();
  }

  ngOnInit() {
    this._disableMenu();

    this.primaryForm = new FormGroup({
      email: new FormControl("", Validators.email),
    });
  }
}
