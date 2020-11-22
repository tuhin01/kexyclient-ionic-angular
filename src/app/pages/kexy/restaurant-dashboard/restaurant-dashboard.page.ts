import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";

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
    public navCtrl: NavController
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
    if (this.router.getCurrentNavigation().extras.state) {
      this.params = this.router.getCurrentNavigation().extras.state;
    }
  }

  async ngOnInit() {
    this.notificationCount = 0;
    this.online_user_list = [];
    await this._enableRestaurantMenu();
    await this._loadDefaultSide();

    this.currentUser = await this.storage.get(constants.STORAGE_USER);
    // TODO - Fix me
    // this.nodeSocket.setUserId(this.currentUser.id);
    //
    // this.nodeSocket.event("conversation-list-updated").subscribe(({ conversation_list }) => {
    //   conversation_list.sort((a, b) => {
    //     if (b.updated_at === a.updated_at) return b.id - a.id;
    //     return Date.parse(b.updated_at) - Date.parse(a.updated_at);
    //   });
    //   this.conversation_list = conversation_list;
    //   this.conversation_list_backup = conversation_list;
    //   this.unreadMessageCount = this.conversation_list.filter((c) => c.unread_message_count > 0).length;
    // });
    // this.nodeSocket.subscribeToUserOnlineStatus((list) => (this.online_user_list = list));
    // this._setupNotificationCountUpdate();
  }

  async openMenu() {
    await this.menu.open("restaurantMenu");
  }

  async ionViewDidEnter() {
    await this._enableRestaurantMenu();
    await this._getDashboardData();
    // TODO - Fix me
    // this.nodeSocket.emit("request-push", { event: "conversation-list-updated" });
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

  async _getDashboardData(): Promise<any> {
    let res = await this.callApi(apis.API_USER_GET_DASHBOARD_DATA, {}, { shouldBlockUi: false });
    if (!res.success) return;
    // this.unreadMessageCount = res.data.unread_message;
  }

  async addOrderTapped(type) {
    await this.navigateTo(
      `${routeConstants.KEXY.RESTAURANT_TABS}/${routeConstants.KEXY.PLACE_ORDER}`,
      { pageType: type }
    );
  }

  async reviewOrdersTapped(type) {
    // TODO - Fix
    // await this.navCtrl.push("ReviewOrderPage", { pageType: type });
  }

  employeeScheduleTapped() {
    let appId, appStoreUrl;

    // if (this.platform.is("ios")) {
    //   appId = "ossapp://";
    //   appStoreUrl = "itms-apps://itunes.apple.com/us/app/opensimsim/id1059921540";
    // } else if (this.platform.is("android")) {
    //   appId = "ossapp://";
    //   appStoreUrl = "market://details?id=com.opensimsim";
    // }
    //
    // this.appAvailability.check(appId).then(
    //     (yes: boolean) => {
    //       window.open(appId, "_system");
    //     },
    //     (no: boolean) => {
    //       window.open(appStoreUrl, "_system", "location=no");
    //     }
    // );
  }

  async showPartnerRelationWithOpensimsim() {
    let notice = await this.storage.get("__OPENSIMSIM_NOTICE");

    if (notice !== "showed") {
      this.openSimSimNotice = true;
    } else {
      this.employeeScheduleTapped();
    }
  }

  async undersatndOpenSimSimNotice() {
    await this.storage.set("__OPENSIMSIM_NOTICE", "showed");
    this.openSimSimNotice = false;
    this.employeeScheduleTapped();
  }
}
