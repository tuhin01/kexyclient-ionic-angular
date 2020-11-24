import { Component, OnInit } from '@angular/core';
import {BasePage} from '../../basePage';
import {ActivatedRoute, Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {AlertController, LoadingController, MenuController, NavController} from '@ionic/angular';
import {routeConstants} from '../../../../common/routeConstants';

@Component({
  selector: 'app-join-marketplace',
  templateUrl: './join-marketplace.page.html',
  styleUrls: ['./join-marketplace.page.scss'],
})
export class JoinMarketplacePage extends BasePage implements OnInit {
  private readonly params: any;

  private email: string = '';
  public ogranizationName:string = '';
  private organization_invitations;
  private employee_invitations;

  constructor(
      public router: Router,
      public route: ActivatedRoute,
      public storage: Storage,
      public httpClient: HttpClient,
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController,
      public menu: MenuController,
      public navCtrl: NavController
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);

    if (this.router.getCurrentNavigation().extras.state) {
      this.params = this.router.getCurrentNavigation().extras.state;
    }

  }

  ngOnInit() {
    this.email = this.params.email;
    this.organization_invitations = this.params.organization_invitations;
    this.employee_invitations = this.params.employee_invitations;

    this._disableMenu();

    console.log(this.organization_invitations);
    console.log(this.employee_invitations);
    if (this.organization_invitations.length) {
      this.ogranizationName = this.organization_invitations[0].organization_name;
    }
    if (this.employee_invitations.length) {
      this.ogranizationName = this.employee_invitations[0].organization_name;
    }

  }

  async goToMarketPlace() {
    let data = {
      email: this.email,
      organization_invitations: this.organization_invitations,
      employee_invitations: this.employee_invitations
    }
    await this.navigateTo(routeConstants.CANNABIS.REGISTER, data);
  }

}
