import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";
import { AppUpdateService } from "../../../services/app-update.service";

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
    private appUpdateService: AppUpdateService
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
    (async () => {
      await this.appUpdateService.__checkAppUpdates();
    })();
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
      `${routeConstants.CANNABIS.RESTAURANT_TABS}/${routeConstants.CANNABIS.PLACE_ORDER}`,
      { pageType: type }
    );
  }

  async reviewOrdersTapped(type) {
    await this.navigateTo(
      `${routeConstants.CANNABIS.RESTAURANT_TABS}/${routeConstants.CANNABIS.REVIEW_ORDER}`,
      { pageType: type }
    );
  }

}
