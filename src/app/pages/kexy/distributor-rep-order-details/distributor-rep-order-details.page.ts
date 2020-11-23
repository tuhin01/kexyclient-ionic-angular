import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController, NavParams } from '@ionic/angular';
import {apis, constants} from "../../../../common/shared";

@Component({
  selector: 'app-distributor-rep-order-details',
  templateUrl: './distributor-rep-order-details.page.html',
  styleUrls: ['./distributor-rep-order-details.page.scss'],
})
export class DistributorRepOrderDetailsPage extends BasePage implements OnInit {
  org: any;
  user: any;
  order_id: any;
  order_status: any;
  order_date: any;
  order_number: any;
  restaurant_name: any;
  order_categories: any;
  
  constructor(
    public router: Router,
    public navParams: NavParams,
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
    this.org = await this.storage.get(constants.STORAGE_ORGANIZATION);
    this.user = await this.storage.get(constants.STORAGE_USER);
    console.log(this.org.name);
    console.log(this.user);
    this.order_id = await this.navParams.get('order_id');
    this.order_status = await this.navParams.get('order_status');
    this.order_date = new Date(this.navParams.get('order_date'));
    this.order_number = await this.navParams.get('order_number');
    this.restaurant_name = await this.navParams.get('restaurant_name');
    console.log(this.order_status);
    await this.prepareOrderList();

  }

  async prepareOrderList() {
    let res = await this.callApi(apis.API_DISTRIBUTOR_ORDER_DETAILS, {
      order_id: this.order_id,
    }, { shouldBlockUi: true });
    if (!res.success) return;
    this.order_categories = res.data.order_categories;
    console.log('order_categories', this.order_categories)
  }

  async orderConfirmTapped() {
    let res = await this.callApi(apis.API_DISTRIBUTOR_CONFIRM_ORDER, {
      order_id: this.order_id,
      distributor_id: this.org.distributor_id,
    }, { shouldBlockUi: true });
    if (!res.success) return;

    await this.showAwaitableAlert("Success!", "Order has been confirmed.");
    this.navCtrl.pop();

  }
}
