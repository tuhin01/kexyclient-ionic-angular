import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { routeConstants } from 'src/common/routeConstants';
import { apis, constants } from "../../../../common/shared";

@Component({
  selector: 'app-supplier-dashboard',
  templateUrl: './supplier-dashboard.page.html',
  styleUrls: ['./supplier-dashboard.page.scss'],
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
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this.notificationCount = 0;
    this.online_user_list = [];
  }
  
  async _getDashboardData() {
    this.organization = await this.storage.get(constants.STORAGE_ORGANIZATION);
    console.log(this.organization);
    let res = await this.callApi(apis.API_USER_GET_DASHBOARD_DATA, {}, { shouldBlockUi: false });
    if (!res.success) return;
    // this.unreadMessageCount = res.data.unread_message;
  }

  async ionViewDidEnter() {
    this.currentUser = await this.storage.get(constants.STORAGE_USER);

    this._enableSupplierMenu();
    this._getDashboardData();
  }

  messagesTapped() {
    this.navigateTo(routeConstants.KEXY.MESSAGE);
    
  }

  public contactBtnTapped(): void {
    this.navigateTo(routeConstants.KEXY.ALL_CONTACTS);
    
  }

}
