import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { apis, constants } from "../../../../common/shared";
import { Storage } from "@ionic/storage";
import { BasePage } from "../../basePage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import {routeConstants} from '../../../../common/routeConstants';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage extends BasePage implements OnInit {
  primaryForm;
  private rememberMe;
  private emailAddress;
  public isMobileLogin: boolean = false;
  public loginText = "Login using phone number?";

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public menu: MenuController,
    public navCtrl: NavController
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // Defaults to 0 if no query param provided.
      this.emailAddress = params["email"];
    });
    this._disableMenu();

    this.primaryForm = new FormGroup({
      email: new FormControl(
        this.emailAddress,
        Validators.compose([Validators.email, Validators.minLength(3), Validators.maxLength(64)])
      ),
      phone: new FormControl(
        "+1",
        Validators.compose([
          Validators.minLength(0),
          Validators.maxLength(21),
          Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(64)])
      ),
      rememberMe: new FormControl(true),
    });

    this.initialHref = window.location.href;

    this.removeLocalUserData();
    this._loadLastUsedPhone();
    this._loadLastUsedEmail();
  }

  getEmail() {
    return this.emailAddress || "notprovided2@gmail.com";
  }

  async _loadLastUsedEmail() {
    let email = await this.storage.get("__LAST_USED_EMAIL");
    this.primaryForm.controls["email"].setValue(email);
  }

  async _loadLastUsedPhone() {
    let phone = await this.storage.get("MOBILE_LOGIN");
    if (phone) {
      this.isMobileLogin = true;
      this.loginText = "Login using email?";
    } else {
      this.isMobileLogin = false;
      this.loginText = "Login using phone number?";
    }
    console.log(phone);
    this.primaryForm.controls["phone"].setValue(phone);
  }

  async primaryFormSubmitted() {
    if (!this.primaryForm.valid) {
      return;
    }

    let data: any = {};
    Object.assign(data, this.primaryForm.value);
    this.rememberMe = data.rememberMe;
    delete data.rememberMe;

    if (this.rememberMe) {
      await this.storage.set("__REMEMBER_ME__EMAIL", data.email);
    }

    if (this.isMobileLogin) {
      data.phone = data.phone.replace(/\D/g, "");
      let res = await this.callApi(apis.API_USER_MOBILE_LOGIN, data);
      if (!res.success) return;
      data = { email: res.data.email, password: res.data.password };
      await this.storage.set("__LAST_USED_EMAIL", null);
      await this.storage.set("MOBILE_LOGIN", this.primaryForm.value.phone);
    } else {
      await this.storage.set("MOBILE_LOGIN", null);
      await this.storage.set("__LAST_USED_EMAIL", data.email);
    }

    await this.handleLogin(data);
  }

  async handleLogin(data) {
    let res = await this.callApi(apis.API_USER_LOGIN, data);
    if (!res.success) return;
    console.log(res);
    // If master password is used to login then do not check firebase auth
    // as it will fail since we do not know user's real password
    if (!res.data.used_masterpassword) {
      // TODO - Fix when firebase is updated
    }
    await this.storeDataAfterLogin(res.data);
    await this.setRootWithAnimationForward(routeConstants.HOME);
  }

  async forgotPasswordTapped() {
    await this.navigateTo(routeConstants.KEXY.FORGET_PASSWORD);
  }

  async createOrJoinTapped() {
    await this.setRootWithAnimationBackword(routeConstants.KEXY.LOGIN_DICISION, { from: "login" });
    return;
  }

  public initialHref;

  async logoTapped() {
    if (!(<any>window).__timesTriedAppMode) {
      (<any>window).__timesTriedAppMode = 0;
    }
    (<any>window).__timesTriedAppMode += 1;
    if ((<any>window).__timesTriedAppMode !== 5) {
      return;
    }
    (<any>window).__timesTriedAppMode = 0;
    window.localStorage.setItem(constants.USER_APP_TYEP, "dispensary");
    // Reload the app to show the correct statusbar color based on cannabis or restaurant
    window.location = this.initialHref;
    // window.location.reload();
    // TODO - Fix
    this.setRoot(routeConstants.HOME)
    //await this.navCtrl.setRoot(HomePage);
  }

  internalBuildTapped() {
    if (!(<any>window).__timesTriedDevMode) {
      (<any>window).__timesTriedDevMode = 0;
    }
    (<any>window).__timesTriedDevMode += 1;
    if ((<any>window).__timesTriedDevMode !== 5) {
      return;
    }
    (<any>window).__timesTriedDevMode = 0;
    const correctAnswer = "Abcd1234!";
    const keyName = "--kexy--is-dev";
    let answer = prompt("Please enter kexy internal password to enable dev mode");
    if (answer === correctAnswer) {
      let isDev = window.localStorage.getItem(keyName);
      isDev = isDev === "NO" ? "YES" : "NO";
      window.localStorage.setItem(keyName, isDev);
      this.navigateTo(routeConstants.KEXY.LOGOUT);
     
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      alert("Invalid Response");
    }
  }

  loginUsingphoneNumber() {
    this.isMobileLogin = !this.isMobileLogin;
    if (this.isMobileLogin) {
      this.loginText = "Login using email?";
    } else {
      this.loginText = "Login using phone number?";
    }
  }
}
