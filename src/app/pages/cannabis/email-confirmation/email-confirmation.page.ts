import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";

@Component({
  selector: "app-email-confirmation",
  templateUrl: "./email-confirmation.page.html",
  styleUrls: ["./email-confirmation.page.scss"],
})
export class EmailConfirmationPage extends BasePage implements OnInit {
  private readonly params: any;
  private typeEmailConfirmation: string = "registrer";

  public primaryForm;
  public title: string = "";
  public subTitle: string = "";
  public submitDisabled: boolean = false;

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

    this.primaryForm = new FormGroup({
      email: new FormControl("", Validators.email),
    });
    this.typeEmailConfirmation = this.params && this.params.type;
    console.log(this.typeEmailConfirmation);
    if (this.typeEmailConfirmation == "join") {
      this.title = "Join a Marketplace";
      this.subTitle = `We'll send you an email to confirm your email address. Once confirmed, your email address 
        will be used to find existing marketplaces that you have joined or have invitation(s) to join.`;
    }
    if (this.typeEmailConfirmation == "registrer") {
      this.title = "Create a New Marketplace";
      this.subTitle =
        "Please confirm your email address in order to create a marketplace from scratch.";
    }
  }

  async ionViewDidEnter() {
    this.submitDisabled = false;
    let isJoinType = await this.storage.get(constants.IS_JOIN_TYPE);
    console.log(isJoinType);
  }

  async primaryFormSubmitted() {
    if (!this.primaryForm.valid) return;
    this.submitDisabled = true;
    let type = this.typeEmailConfirmation;
    const url =
      type === "join"
        ? "API_USER_SEND_INVITATION_CONFIRMATION_CODE"
        : "API_USER_SEND_CONFIRMATION_CODE";
    let res = await this.callApi(apis[url], this.primaryForm.value);
    if (!res.success) {
      this.submitDisabled = false;
      return;
    }
    let isInvited = false;
    if (res.is_invited) {
      isInvited = true;
    }
    await this.navigateTo(routeConstants.KEXY.EMAIL_VERIFICATION, {
      type: this.typeEmailConfirmation,
      is_invited: isInvited,
      email: this.primaryForm.value.email,
    });
  }
}
