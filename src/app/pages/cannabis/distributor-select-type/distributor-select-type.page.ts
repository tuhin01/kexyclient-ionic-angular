import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { BasePage } from '../../basePage';
import {Storage} from '@ionic/storage';
import { routeConstants } from 'src/common/routeConstants';
@Component({
  selector: 'app-distributor-select-type',
  templateUrl: './distributor-select-type.page.html',
  styleUrls: ['./distributor-select-type.page.scss'],
})
export class DistributorSelectTypePage extends BasePage implements OnInit {
  private readonly params: any;
  side: string = 'FOH';
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
  }
  public nextBtnTapped() {
    const restaurantIdList = this.params.restaurantIdList;
    this.navigateTo(routeConstants.CANNABIS.DISTRIBUTOR_CREATE,{
      side: this.side, restaurantIdList
    })
    
  }
}
