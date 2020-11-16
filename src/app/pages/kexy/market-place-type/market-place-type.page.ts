import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, NavController } from '@ionic/angular';
import { BasePage } from '../../basePage';
import {Storage} from '@ionic/storage';
import { routeConstants } from 'src/common/routeConstants';
@Component({
  selector: 'app-market-place-type',
  templateUrl: './market-place-type.page.html',
  styleUrls: ['./market-place-type.page.scss'],
})
export class MarketPlaceTypePage extends BasePage implements OnInit {
  private readonly params: any;
  private marketPlaceType: string = 'restaurant';
  private organization_invitations;

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
    if (this.router.getCurrentNavigation().extras.state) {
      this.params = this.router.getCurrentNavigation().extras.state;
    }
  }

  ngOnInit() {
    this._disableMenu();

    let invitations = this.params.organization_invitations;
    this.organization_invitations = invitations ? invitations : [];
  }
private nextBtnTapped() {
    console.log(this.organization_invitations);
    let restaurantIdList = [];
    let distributorIdList = [];

    if (this.organization_invitations.length) {
      this.organization_invitations.forEach((item) => {
        if (item.restaurant_id) restaurantIdList.push(item.restaurant_id);
        if (item.distributor_id) distributorIdList.push(item.distributor_id);
      })
    }


    if (this.marketPlaceType === 'distributor') {
     
      this.navigateTo(routeConstants.KEXY.DISTRIBUTOR_SELECT_TYPE)
     
    }
    if (this.marketPlaceType === 'restaurant') {
        this.navigateTo(routeConstants.KEXY.RESTAURANT_TYPE)
    }
    if (this.marketPlaceType === 'supplier') {
           //TODO - Fix
      // this.navCtrl.push("SupplierSelectTypePage", {distributorIdList});
    }

  }
}
