import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { BasePage } from '../../basePage';
import {Storage} from '@ionic/storage';
import { apis } from 'src/common/shared';
import { routeConstants } from 'src/common/routeConstants';

@Component({
  selector: 'app-distributor-setup-restaurant-bar',
  templateUrl: './distributor-setup-restaurant-bar.page.html',
  styleUrls: ['./distributor-setup-restaurant-bar.page.scss'],
})
export class DistributorSetupRestaurantBarPage extends BasePage implements OnInit {
  private readonly params: any;
  private distributor_id: number;
  private searchedWithZipCode: string;
  private zip_code_list;
  private side: string;
  private search_string: string = "";
  private userDetails: any;
  private file: any;
  //private listOfValidEmails: any[] = [];
  private listOfInvalidEmails: any[] = [];
  private allSelected: boolean;

  private emailRegExp: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  private restaurant_list: Object[] = [];
  private selected_restaurant_id_list: number[] = [];
  private invited_list: Object[] = [];

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

    this.selected_restaurant_id_list = [];
    this.restaurant_list = [];
    this.invited_list = [];

    this.zip_code_list = this.params.zip_code_list;
    this.searchedWithZipCode = this.zip_code_list.reduce((str, item) => {
      return str + item.zip_code + ", "
    }, "").slice(0, -2);
    this.side = this.params.side;
    this.distributor_id = this.params.distributor_id;
    this.listMatchingRestaurants(this.zip_code_list);
  }
  async listMatchingRestaurants(zip_code_list) {
    let res = await this.callApi(apis.API_DISTRIBUTOR_LIST_ALL_RESTAURANTS, {
      zip_code_list,
      search_string: this.search_string
    });
    if (!res.success) return;
    this.restaurant_list = res.data.restaurant_list;
  }

  public toggleRestaurantSelection(id): void {
    let index = this.selected_restaurant_id_list.indexOf(id);
    if (index > -1) {
      this.selected_restaurant_id_list.splice(index, 1);
    } else {
      this.selected_restaurant_id_list.push(id);
    }
  }

  public changeZipCode(): void {
    //TODO- Fix
    // (this.alertCtrl.create({
    //   title: 'Enter a Zip Code',
    //   message: "",
    //   inputs: [
    //     {
    //       name: 'zip_code',
    //       placeholder: 'Zip code',
    //       type: 'text'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => {
    //         'pass';
    //       }
    //     },
    //     {
    //       text: 'Change',
    //       handler: data => {
    //         let { zip_code } = data;
    //         if (!zip_code) {
    //           return this.showAwaitableAlert("Invalid Zip Code", "The zip code you entered is not valid.");
    //         }
    //         let zipCodeList = zip_code.split(',').map((zipCode) => {
    //           // TODO: Validate
    //           return { zip_code: zipCode.trim() };
    //         });
    //         this.listMatchingRestaurants(zipCodeList);
    //       }
    //     }
    //   ]
    // })).present();
  }

  public searchStringChanged(): void {
    this.listMatchingRestaurants(this.zip_code_list);
  }

  private validateEmail(email: string): boolean {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  public addAnotherInvitation(): void {
    //TODO-Fix
    // const prompt = this.alertCtrl.create({
    //   title: 'Invite Restaurant/Bar',
    //   message: "Enter an email address",
    //   inputs: [
    //     {
    //       name: 'invited',
    //       placeholder: 'Email Address',
    //       type: 'email'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => {
    //         'pass';
    //       }
    //     },
    //     {
    //       text: 'Save',
    //       handler: data => {
    //         let { invited } = data;
    //         if (!this.validateEmail(invited)) {
    //           this.showAwaitableAlert("Sorry!", "The email address you entered is not valid.");
    //           return;
    //         }
    //         this.invited_list.push(invited);
    //       }
    //     }
    //   ]
    // });
    // prompt.present();
  }

  async processSelection(): Promise<any> {
    let data = {
      restaurant_id_list: this.selected_restaurant_id_list,
      distributor_id: this.distributor_id
    }
    let res = await this.callApi(apis.API_DISTRIBUTOR_SELECT_RESTAURANTS, data);
    return res.success;
  }

  async processInvites(): Promise<any> {
    let data = {
      invited_restaurant_email_list: this.invited_list,
      distributor_id: this.distributor_id
    }
    let res = await this.callApi(apis.API_DISTRIBUTOR_INVITE_RESTAURANTS, data);
    return res.success;
  }

  async continueBtnTapped(): Promise<void> {
    let res = await this.processSelection();
    if (!res) return;
    let res2 = await this.processInvites();
    if (!res2) return;

    this.navigateTo(routeConstants.KEXY.INVITE_DISTRIBUTOR_EMPLOYEE,{
      distributor_id: this.distributor_id
    })

  }

  public changeListener($event: any): void {
    this.file = $event.target.files[0];
    let that = this;

    // papa.parse(this.file, {
    //   complete: function (results) {
    //     let invalidEmailsString: string = '';
    //
    //     /***this cycle below validate list of emails from the file ***/
    //     for (var i = 0; i < results.data.length; i++) {
    //       if (that.emailRegExp.test(results.data[i][0].toString())) {
    //         //that.listOfValidEmails.push(results.data[i][0].toString());
    //         that.invited_list.push(results.data[i][0].toString());
    //       } else {
    //         that.listOfInvalidEmails.push(results.data[i][0].toString());
    //
    //         /*** this 5 rows of js below create string with the list of invalid emails ***/
    //         if (that.listOfInvalidEmails.length === 1) {
    //           invalidEmailsString += results.data[i][0].toString();
    //         } else {
    //           invalidEmailsString += ', ' + results.data[i][0].toString();
    //         }
    //       }
    //     }
    //
    //     /*** notification with the list of invalid e-mails ***/
    //     if (that.listOfInvalidEmails.length) {
    //       that.showAwaitableAlert("Sorry!", "You have invalid email addresses in your list. Those are: " + invalidEmailsString);
    //     }
    //   }
    // });
  }

  selectAllRestaurant() {
    if (this.allSelected) {
      this.selected_restaurant_id_list = this.restaurant_list.map(restaurant => (restaurant as any).id);
    } else {
      this.selected_restaurant_id_list = []
    }
  }

  deleteInviteTapped(i){
    this.invited_list.splice(i, 1);
  }
}
