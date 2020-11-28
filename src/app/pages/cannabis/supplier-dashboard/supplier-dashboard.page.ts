import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingController, AlertController, MenuController, NavController } from "@ionic/angular";
import { routeConstants } from "src/common/routeConstants";
import { apis, constants } from "../../../../common/shared";
import { AppUpdateService } from "../../../services/app-update.service";

@Component({
  selector: "app-supplier-dashboard",
  templateUrl: "./supplier-dashboard.page.html",
  styleUrls: ["./supplier-dashboard.page.scss"],
})
export class SupplierDashboardPage extends BasePage implements OnInit {
  public uid: {};
  public notificationCount: any;
  public unreadMessageCount: any;
  private organization;

  public currentUser;
  online_user_list: any = [];
  conversation_list: any = [];
  conversation_list_backup: any = [];

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
  }

  ngOnInit() {
    this.notificationCount = 0;
    this.online_user_list = [];
    (async () => {
      this.currentUser = await this.storage.get(constants.STORAGE_USER);
      await this._enableSupplierMenu();
      await this._getDashboardData();
    })();
  }

  ionViewDidEnter() {
    (async () => {
      await this.appUpdateService.__checkAppUpdates();
    })();
  }

  async _getDashboardData() {
    this.organization = await this.storage.get(constants.STORAGE_ORGANIZATION);
    console.log(this.organization);
    let res = await this.callApi(apis.API_USER_GET_DASHBOARD_DATA, {}, { shouldBlockUi: false });
    if (!res.success) return;
  }

  async messagesTapped() {
    await this.navigateTo(routeConstants.CANNABIS.MESSAGE);
  }

  async contactBtnTapped() {
    await this.navigateTo(routeConstants.CANNABIS.ALL_CONTACTS);
  }
}
