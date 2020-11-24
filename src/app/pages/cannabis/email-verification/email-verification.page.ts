import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { BasePage } from "../../basePage";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { apis } from "../../../../common/shared";
import {routeConstants} from '../../../../common/routeConstants';

@Component({
  selector: "app-email-verification",
  templateUrl: "./email-verification.page.html",
  styleUrls: ["./email-verification.page.scss"],
})
export class EmailVerificationPage extends BasePage implements OnInit {
  private readonly params: any;
  private type: string;
  private isInvited: boolean = false;

  public primaryForm;
  public email: string;
  public showResendButton: boolean = false;

  constructor(
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
      this.params = this.router.getCurrentNavigation().extras.state;
    }
  }

  ngOnInit() {
    this._disableMenu();
    this.email = this.params.email;
    this.type = this.params.type;
    this.isInvited = this.params.is_invited;

    this.primaryForm = new FormGroup({
      confirmation_code: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern("^[0-9]+$"),
        ])
      ),
    });

    this.setTimerForShowingResendButton();
  }

  private setTimerForShowingResendButton() {
    setTimeout(() => {
      this.showResendButton = true;
    }, 15 * 1000);
  }

  async primaryFormSubmitted() {
    if (!this.primaryForm.valid) return;

    const joinByInvitation = this.type === "join" && this.isInvited;

    const url = joinByInvitation
      ? "API_USER_VERIFY_INVITATION_CONFIRMATION_CODE"
      : "API_USER_VERIFY_CONFIRMATION_CODE";

    let data = { email: this.email };
    Object.assign(data, this.primaryForm.value);
    let res = await this.callApi(apis[url], data);
    if (!res.success) return;

    if (joinByInvitation) {
      let { organization_invitations, employee_invitations } = res.data;
      await this.navigateTo(routeConstants.KEXY.JOIN_MARKETPLACED, {
        email: this.email,
        organization_invitations,
        employee_invitations,
      });
    } else {
      Object.assign(data, { is_invited: this.isInvited, type: this.type });
      await this.navigateTo(routeConstants.KEXY.REGISTER, data);
    }
  }

  async resendVerificationCode() {
    const url =
      this.type === "join" && this.isInvited
        ? "API_USER_SEND_INVITATION_CONFIRMATION_CODE"
        : "API_USER_SEND_CONFIRMATION_CODE";
    let res = await this.callApi(apis[url], { email: this.email });
    if (!res.success) return;
    await this.showAwaitableAlert("Success!", "We have sent you another confirmation code.");
    this.showResendButton = false;
    this.setTimerForShowingResendButton();
  }
}
