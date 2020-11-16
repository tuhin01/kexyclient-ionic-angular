import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { BasePage } from '../../basePage';
import {Storage} from '@ionic/storage';
import { routeConstants } from 'src/common/routeConstants';

@Component({
  selector: 'app-supplier-select-type',
  templateUrl: './supplier-select-type.page.html',
  styleUrls: ['./supplier-select-type.page.scss'],
})

export class SupplierSelectTypePage extends BasePage implements OnInit {
  private readonly params: any;
  public side: string = 'FOH';

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
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CannabisSupplierSelectTypePage');
  }

  public nextBtnTapped(): void {
    const restaurantIdList = this.params.restaurantIdList;
    this.navigateTo(routeConstants.KEXY.RESTAURANT_CREATE)
    
  }
}
