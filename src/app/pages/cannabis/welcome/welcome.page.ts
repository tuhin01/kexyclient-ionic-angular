import { Component, OnInit } from '@angular/core';
import {BasePage} from '../../basePage';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {AlertController, LoadingController, MenuController, NavController} from '@ionic/angular';
import {apis, constants} from '../../../../common/shared';
import {routeConstants} from '../../../../common/routeConstants';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage extends BasePage implements OnInit {
  private readonly params: any;
  private restaurant_id: number;
  private distributor_id: number;
  private supplier_id: number;
  public isJoinType: any;
  public joinToOrg: string = '';
  public isInvited: boolean;



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

  async ngOnInit() {
    this._disableMenu();
    this.params.restaurant_id ? this.restaurant_id = this.params.restaurant_id : this.restaurant_id = null;
    this.params.distributor_id ? this.distributor_id = this.params.distributor_id : this.distributor_id = null;
    this.params.supplier_id ? this.supplier_id = this.params.supplier_id : this.supplier_id = null;

    this.isJoinType = await this.storage.get(constants.IS_JOIN_TYPE);

    if (this.isJoinType) {
      this.joinToOrg = await this.storage.get(constants.JOIN_TO_ORG);
    }
  }

  public async exploreKexyTapped() {
    if (this.restaurant_id) {

      this.navigateTo(routeConstants.KEXY.TUTORIAL,{
        'signup': true
      });
      // await this.navCtrl.push('TutorialPage', {'signup': true})
      // this.openVideo('i8nablicxl-7s2m42fzx3');
    }
    // if (this.distributor_id) {
    //   this.openVideo('i-B4mXfFu74');
    // }
    // if (this.supplier_id) {
    //   this.openVideo('i-B4mXfFu74');
    // }
  }

  private openVideo(video_id: string): void {
    window.open('https://kexy.fleeq.io/l/' + video_id, "_system", "location=yes");
  }

  public async skipTutorialTapped() {
    await this.setRoot(routeConstants.HOME);
  }

  async changeCompanyTapped() {
    let res = await this.callApi(apis.API_CANCEL_JOIN_REQUEST, {});
    if (res.success) {
      await this.storage.set(constants.IS_JOIN_TYPE, 'join');
      await this.storage.remove(constants.JOIN_TO_ORG);
      await this.setRoot(routeConstants.HOME);
    } else {
      await this.showAwaitableAlert("Warning!", "Something went wrong! Please try again");
    }
  }

  async checkRequestTapped() {
    let joinRequest = await this.callApi(apis.API_CHECK_JOIN_REQUEST, {}, {shouldBlockUi: true});
    if (!joinRequest.success) return;
    if (joinRequest.data.request) {
      if (joinRequest.data.request.status !== 'accepted') {
        await this.showAwaitableAlert("Notice!", "Your request to join has not yet been approved.");
      } else {
        await this.setRoot(routeConstants.HOME);

      }
    }
  }

}
