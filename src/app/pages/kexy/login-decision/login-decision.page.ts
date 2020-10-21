import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import {routeConstants} from '../../../../common/routeConstants';

@Component({
  selector: "app-login-decision",
  templateUrl: "./login-decision.page.html",
  styleUrls: ["./login-decision.page.scss"],
})
export class LoginDecisionPage extends BasePage implements OnInit {
  params;
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
    if (this.params && this.params.from && this.params.from === "login") return;

    (async () => {
      try {
        let lastUsedEmail = await this.storage.get("__LAST_USED_EMAIL");
        console.log({ lastUsedEmail });
        if (lastUsedEmail) {
          await this.setRoot(routeConstants.KEXY.LOGIN);
        }
      } catch (ex) {
        ("pass");
      }
    })();
  }

  async loginTapped() {
    await this.navigateTo(routeConstants.KEXY.LOGIN);
  }

  joinTapped(event): void {
    // TODO - Fix
    // this.navCtrl.push("EmailConfirmationPage", {
    //   type: "join"
    // });
  }

  registerTapped(event): void {
    // TODO - Fix
    // this.navCtrl.push("EmailConfirmationPage", {
    //   type: "registrer"
    // });
  }
}
