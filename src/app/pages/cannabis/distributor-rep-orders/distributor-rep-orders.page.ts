import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import {apis, constants} from "../../../../common/shared";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { routeConstants } from 'src/common/routeConstants';

@Component({
  selector: 'app-distributor-rep-orders',
  templateUrl: './distributor-rep-orders.page.html',
  styleUrls: ['./distributor-rep-orders.page.scss'],
})
export class DistributorRepOrdersPage extends BasePage implements OnInit {
  org: any;
  user: any;
  public sort: boolean = false;
  orderList: any = [];

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
    this._preparePage();
  }
  async _preparePage() {
    this.sort = false;
    this.orderList = [];
    this.org = await this.storage.get(constants.STORAGE_ORGANIZATION);
    this.user = await this.storage.get(constants.STORAGE_USER);
    await this.prepareOrderList();
  }
  
  ionViewWillEnter() {
    this._preparePage();
  }


  async prepareOrderList() {
    let res = await this.callApi(apis.API_DISTRIBUTOR_All_ORDERS, {
      distributor_id: this.org.distributor_id,
    }, {shouldBlockUi: true});
    if (!res.success) return;
    this.orderList = res.data.orders;
    this.orderList = this.orderList.reverse();
  }

  // ==================================================================

  sortProducts() {
    this.sort = !this.sort;
    this.orderList = this.orderList.reverse();
  }

  dateFormat(date) {
    return (new Date(date));
  }

  orderTapped(order) {
    let order_id = order.order_id;
    let order_status = order.status;
    let order_date = order.order.order_date;
    let order_number = order.order.order_number;
    let restaurant_name = order.order.restaurant.name;
    this.navigateTo(routeConstants.CANNABIS.DISTRIBUTOR_REP_ORDER_DETAILS),{
      order_id: order_id,
      order_status: order_status,
      order_date: order_date,
      order_number: order_number,
      restaurant_name: restaurant_name
    }

}
}
