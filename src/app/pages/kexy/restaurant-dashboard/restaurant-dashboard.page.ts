import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import {
  AlertController,
  LoadingController,
  MenuController,
  NavController,
  Platform,
} from "@ionic/angular";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";
import { Deploy } from "cordova-plugin-ionic/dist/ngx";

@Component({
  selector: "app-restaurant-dashboard",
  templateUrl: "./restaurant-dashboard.page.html",
  styleUrls: ["./restaurant-dashboard.page.scss"],
})
export class RestaurantDashboardPage extends BasePage implements OnInit {
  private readonly params: any;
  public uid: {};
  public notificationCount: any;
  public unreadMessageCount: any;
  public allowedSide = "";

  public restaurantSide: string;
  public categories: Array<{ imgPath: string; catName: string }>;
  public org: any;
  public openSimSimNotice = false;

  public currentUser;
  public online_user_list: any = [];
  public conversation_list: any = [];
  public conversation_list_backup: any = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    private deploy: Deploy,
    private platform: Platform
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
    if (this.router.getCurrentNavigation().extras.state) {
      this.params = this.router.getCurrentNavigation().extras.state;
    }
  }

  ngOnInit() {
    this.notificationCount = 0;
    this.online_user_list = [];
    (async () => {
      await this._enableRestaurantMenu();
      await this._loadDefaultSide();
    })();
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    (async () => {
      if (this.platform.is("cordova")) {
        await this.__checkAppUpdates();
      }
    })();
  }

  async __checkAppUpdates() {
    const update = await this.deploy.checkForUpdate();
    console.log({ update });
    if (update.available) {
      await this.__presentUpdateDownloadPopup();
    }
  }

  async __presentUpdateDownloadPopup() {
    const alert = await this.alertCtrl.create({
      cssClass: "my-custom-class",
      header: "Updates Available!",
      message: "There is a new version of the app available. Please update now.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Update",
          handler: async () => {
            await this.deploy.downloadUpdate((progress) => {
              console.log(progress);
            });
            await this.deploy.extractUpdate((progress) => {
              console.log(progress);
            });
            location.reload();
          },
        },
      ],
    });

    await alert.present();
  }

  async openMenu() {
    await this.menu.open("restaurantMenu");
  }

  async _loadDefaultSide() {
    this.org = await this.storage.get(constants.STORAGE_ORGANIZATION);
    this.allowedSide = this.org.side.toLowerCase();
    if (this.org.side.toLowerCase() === "boh") {
      this.restaurantSide = "boh";
    } else {
      this.restaurantSide = "foh";
    }
  }

  async addOrderTapped(type) {
    await this.navigateTo(
      `${routeConstants.KEXY.RESTAURANT_TABS}/${routeConstants.KEXY.PLACE_ORDER}`,
      { pageType: type }
    );
  }

  async reviewOrdersTapped(type) {
    await this.navigateTo(
      `${routeConstants.KEXY.RESTAURANT_TABS}/${routeConstants.KEXY.REVIEW_ORDER}`,
      { pageType: type }
    );
  }
}
