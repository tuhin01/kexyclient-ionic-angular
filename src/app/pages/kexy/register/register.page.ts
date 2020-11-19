import { Component, OnInit } from '@angular/core';
import {EmployeeInvitation} from '../../../interfaces/api-response-model';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {AlertController, LoadingController, MenuController, NavController} from '@ionic/angular';
import {BasePage} from '../../basePage';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {apis, constants} from '../../../../common/shared';
import {routeConstants} from '../../../../common/routeConstants';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage extends BasePage implements OnInit {
  private email: string;
  private employee_invitations: Array<EmployeeInvitation>;
  private organization_invitations: Array<any>;

  public primaryForm;
  public hasAgreedToTermsAndConditions = false;
  private isInvited: boolean = false;
  private type: string = "";
  public imageUrl = null;

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
    this._disableMenu();

    this.email = this.params.email;
    this.employee_invitations = this.params.employee_invitations;
    this.organization_invitations = this.params.organization_invitations;
    this.isInvited = this.params.is_invited;
    this.type = this.params.type;

    this.primaryForm = new FormGroup({
      first_name: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(0),
            Validators.maxLength(64),
            Validators.pattern("^[a-zA-Z- ]+$"),
          ])
      ),
      last_name: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(0),
            Validators.maxLength(64),
            Validators.pattern("^[a-zA-Z- ]+$"),
          ])
      ),
      job_title: new FormControl("", Validators.compose([Validators.required, Validators.minLength(0), Validators.maxLength(128)])),
      phone: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(0),
            Validators.maxLength(21),
            Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
          ])
      ),
      password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(64)])),
    });
  }

  public getEmail(): string {
    return this.email || "notprovided2@gmail.com";
  }

  private async setNextPage(user: any): Promise<any> {
    if (this.organization_invitations && this.organization_invitations.length) {
      let acceptInvitationApiRes = await this.callApi(apis.MAKE_INVITATION_ACCEPTED_UPON_REGISTER, { email: this.email });

      await this.setRoot(routeConstants.KEXY.MARKETPLACE_TYPE, { organization_invitations: this.organization_invitations });

    } else {
      if (this.employee_invitations && this.employee_invitations.length) {
        let addEmployeeApiRes = await this.callApi(apis.API_ADD_EMPLOYEE_FROM_INVITATION, {
          employee_invitations: this.employee_invitations,
          userId: user.id,
          email: this.email,
        });
        let invitation = this.employee_invitations[0];
        await this.navigateTo(routeConstants.KEXY.WELCOME, {
          distributor_id: invitation.distributor_id,
          restaurant_id: invitation.restaurant_id,
          role: invitation.role,
        });

      } else {
        console.log(this.type);
        await this.storage.set(constants.IS_INVITED, this.isInvited);
        await this.storage.set(constants.IS_JOIN_TYPE, this.type);

        await this.setRoot(routeConstants.HOME);
        
      }
    }
  }

  async primaryFormSubmitted(): Promise<any> {
    if (!this.primaryForm.valid) return;
    if (!this.hasAgreedToTermsAndConditions) {
      await this.showAwaitableAlert("Sorry!", "You must agree to the terms and conditions.");
      return;
    }

    let registerData = {
      email: this.getEmail(),
      profile_photo: this.imageUrl,
      phone: "",
    };
    Object.assign(registerData, this.primaryForm.value);

    let loginData = {
      email: this.getEmail(),
      password: this.primaryForm.value.password,
    };

    registerData.phone = registerData.phone.replace(/\D/g, "");

    let res = await this.callApi(apis.API_USER_REGISTER, registerData);
    if (!res.success) return;

    // Firebase login required for fileupload.
    // try {
    //   await this.kFire.login(loginData.email, loginData.password);
    // } catch (ex) {
    //   await this.showAwaitableAlert("Sorry!", ex.message);
    //   return;
    // }

    let res2 = await this.callApi(apis.API_USER_LOGIN, loginData);
    if (!res2.success) return;
    await this.storeDataAfterLogin(res2.data);
    await this.storage.set(constants.JOB_TITLE, this.primaryForm.value.job_title);

    // Call API to create user in getkexy website
    await this.callApi(apis.API_CREATE_USER_IN_WEBSITE, loginData, {shouldBlockUi: false});

    await this.setNextPage(res2.data.user);
  }

  async termsClicked() {
    await this.navigateTo(routeConstants.KEXY.TERMS_AND_CONDITION);
  }

  async presentFileChooser() {
    // TODO - Fix me
    // let imageData = await this.takePhoto.presentFileChooser();
    // if (imageData) {
    //   this.imageUrl = imageData;
    // }
  }

}
