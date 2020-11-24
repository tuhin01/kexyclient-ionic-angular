import { Component, OnInit } from '@angular/core';
import {BasePage} from '../../basePage';
import {AlertController, LoadingController, MenuController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {apis} from '../../../../common/shared';
import {routeConstants} from '../../../../common/routeConstants';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage extends BasePage implements OnInit {
  primaryForm;
  private readonly email: string;
  showResendButton: boolean = false;

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
    if (this.router.getCurrentNavigation().extras.state) {
      this.email = this.router.getCurrentNavigation().extras.state.email;
    }
  }


  ngOnInit() {
    this._disableMenu();
    this.primaryForm = new FormGroup({
      recovery_code: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ])),
      new_password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
      ]))
    });
  }

  private setTimerForShowingResendButton() {
    setTimeout(() => {
      this.showResendButton = true;
    }, 30 * 1000)
  }

  async primaryFormSubmitted() {
    if (!this.primaryForm.valid) return;
    let data = { email: this.email };
    Object.assign(data, this.primaryForm.value);
    let res = await this.callApi(apis.API_USER_VERIFY_PASSWORD_RECOVERY_CODE, data);
    if (!res.success) return;
    await this.navigateTo(routeConstants.CANNABIS.LOGIN, {email: this.email});
  }

  async loginTapped() {
    await this.setRootWithAnimationBackword(routeConstants.CANNABIS.LOGIN, {email: this.email});
  }


  async resendVerificationCode() {
    let res = await this.callApi(apis.API_USER_REQUEST_PASSWORD_RECOVERY_CODE, { email: this.email });
    if (!res.success) return;
    await this.showAwaitableAlert('Success!', 'Confirmation code has been sent.');
    this.showResendButton = false;
    this.setTimerForShowingResendButton()
  }

}
