import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';
import { constants, apis } from '../../../../common/shared';
import { routeConstants } from 'src/common/routeConstants';
@Component({
  selector: 'app-distributor-dashboard',
  templateUrl: './distributor-dashboard.page.html',
  styleUrls: ['./distributor-dashboard.page.scss'],
})
export class DistributorDashboardPage extends BasePage implements OnInit {
  uid: {};
  notificationCount: any;
  unreadMessageCount: any;
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
    // private cameraService: CameraService
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this.notificationCount = 0;
    this.online_user_list = [];
    (async () => {
      await this._enableDistributorMenu();

    })();
   
  }
  async openMenu() {
    await this.menu.open("distributorMenu");
  }


  async _getDashboardData() {
    this.organization = await this.storage.get(constants.STORAGE_ORGANIZATION);
    console.log(this.organization.type);
    let res = await this.callApi(apis.API_USER_GET_DASHBOARD_DATA, {}, { shouldBlockUi: false });
    if (!res.success) return;
    // this.unreadMessageCount = res.data.unread_message;
  }





  async ionViewDidEnter() {
    this.currentUser = await this.storage.get(constants.STORAGE_USER);

    this._enableDistributorMenu();
    this._getDashboardData();
    // this._setupWebSocket();

  }

  addAnotherRestaurant() {
   
      this.navigateTo(routeConstants.KEXY.MY_RESTAURANTS)

  }

  private addAnotherRep(): void {
    this.navigateTo(routeConstants.KEXY.INVITE_DISTRIBUTOR_EMPLOYEE,{
      distributor_id: this.organization.distributor_id,
      from_page: 'my_restaurant'
    })
   }

  messagesTapped() {
 
    this.navigateTo(routeConstants.KEXY.MESSAGE);

  }

  public contactBtnTapped(): void {
     this.navigateTo(routeConstants.KEXY.ALL_CONTACTS);

  }

  restaurantBarTapped() {
   
    this.navigateTo(routeConstants.KEXY.MY_RESTAURANTS);

  }

  

  public invitePeopleTapped() {
 
    this.navigateTo(routeConstants.KEXY.INVITE_PEOPLE);
  
  }


  public myOrdersTapped() {

    this.navigateTo(routeConstants.KEXY.DISTRIBUTOR_REP_ORDERS);
  
  }
}
