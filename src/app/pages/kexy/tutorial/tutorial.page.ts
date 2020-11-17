import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController, NavParams } from '@ionic/angular';
import { BasePage } from '../../basePage';
import {Storage} from '@ionic/storage';
import { routeConstants } from 'src/common/routeConstants';
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage extends BasePage implements OnInit {
  private readonly params: any;
  public isSignup = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    public navParams: NavParams
) {
  super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  if (this.router.getCurrentNavigation().extras.state) {
    this.params = this.router.getCurrentNavigation().extras.state;
  }
}

  ngOnInit() {
    this.isSignup = this.params.get('signup') ? this.params.get('signup') : false;
  }
  public async skipTutorialTapped() {
    this.setRoot(routeConstants.HOME);
  }
}
