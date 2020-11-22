import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { apis, constants } from "../../../../common/shared";

@Component({
  selector: 'app-rep-delivery-method',
  templateUrl: './rep-delivery-method.page.html',
  styleUrls: ['./rep-delivery-method.page.scss'],
})
export class RepDeliveryMethodPage extends BasePage implements OnInit {
  org: any;
  repList = [];
  tempRepList = [];

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
  }
  async ionViewDidLoad() {
        this.org = await this.storage.get(constants.STORAGE_ORGANIZATION);
        let res = await this.callApi(apis.API_RESTAURANT_REP_DELIVERY_METHOD, { "restaurant_id": this.org.restaurant_id });
        if (!res.success) return;

        this.repList = res.data.rep_list;
        this.repList = this.repList.filter(rep => !(rep.distributor_name.indexOf("Distributor_fk") > -1));
    }

    emailCheckboxChanged(repDelivery) {
        this.tempRepList[repDelivery.id] = repDelivery;
    }

    async updateRepDeliveryMethod() {
        console.log("NNN", this.tempRepList);
        let res = await this.callApi(apis.API_RESTAURANT_UPDATE_REP_DELIVERY_METHOD, {'update_delivery_method_list': this.tempRepList});
        if (!res.success) return;
        await this.showAwaitableAlert("Success!", "Updated successfully");
        this.tempRepList = [];
    }
}
