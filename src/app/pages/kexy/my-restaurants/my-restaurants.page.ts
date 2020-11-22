import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { constants, apis } from '../../../../common/shared';
import { LoadingController, AlertController, ModalController, MenuController, NavController, ActionSheetController } from '@ionic/angular';
// import {ActionSheetController, AlertController, IonicPage, LoadingController, MenuController, ModalController, NavController, NavParams} from 'ionic-angular';

// import { LoadingController, AlertController, MenuController, NavController, ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-my-restaurants',
  templateUrl: './my-restaurants.page.html',
  styleUrls: ['./my-restaurants.page.scss'],
})
export class MyRestaurantsPage extends BasePage implements OnInit {
  private restaurant_list = [];
  private restaurant_search_result = [];
  // private showSearchBar: boolean = false;
  private defaultOrgZipCodeList;
  private zipCodeList;
  private side: string;
  private search_string: string = '';
  private organization;
  private selected_restaurant_id_list: number[] = [];
  private selected_restaurant_for_deletion_id_list: number[] = [];
  public selectedTab: string = "list";
  public isSearch: boolean = false;
  private searchedByString: boolean = false;
  private searchedWithZipCode: string;
  private allCurrentOrgSelected: boolean;
  private allSearchOrgSelected: boolean;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public menu: MenuController,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    // private cameraService: CameraService
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this._enableDistributorMenu();
  }
  async ionViewDidEnter() {
    console.log('ionViewDidLoad CannabisMyRestaurantsPage');

    this.organization = await this.storage.get(constants.STORAGE_ORGANIZATION);
    this.defaultOrgZipCodeList = this.organization.zip_code_list.length ? this.organization.zip_code_list : [];
    // if (!this.zipCodeList || !this.zipCodeList.length) {
    this.zipCodeList = this.defaultOrgZipCodeList;
    // }
    this.side = this.organization.side;

    await this.getRestaurantList();
    this.searchStringChanged();
  }


  // private searchIconClicked(): void {
  //  this.showSearchBar = !this.showSearchBar;
  // }

  async getRestaurantList(): Promise<any> {
    console.log(this.zipCodeList)
    let res = await this.callApi(apis.API_GET_ORGANIZATION_SELECTED_ORGANIZATIONS, {
      distributor_id: this.organization.distributor_id,
      restaurant_id: this.organization.restaurant_id
    });
    this.restaurant_list = res.data.restaurant_list;
    this.selected_restaurant_for_deletion_id_list = [];
  }

  async searchStringChanged(): Promise<any> {
    this.isSearch = true;
    let res = await this.callApi(apis.API_DISTRIBUTOR_LIST_ALL_RESTAURANTS, {
      zip_code_list: this.zipCodeList,
      search_string: this.search_string
    }, { shouldBlockUi: true });
    if (!res.success) return;
    res.data.restaurant_list = res.data.restaurant_list.filter(_restaurant => {
      return !this.restaurant_list.find(restaurant => restaurant.id === _restaurant.id);
    });
    this.restaurant_search_result = res.data.restaurant_list;
    this.searchedWithZipCode = this.zipCodeList.reduce((str, item) => {
      return str + item.zip_code + ", "
    }, "").slice(0, -2);
    // this.zipCodeList = this.defaultOrgZipCodeList;
    this.search_string = '';
  }

  private onSearchCancel(): void {
    this.restaurant_search_result = [];
  }

  public toggleRestaurantSelectionForDeletion(id: number): void {
    let index = this.selected_restaurant_for_deletion_id_list.indexOf(id);
    if (index > -1) {
      this.selected_restaurant_for_deletion_id_list.splice(index, 1);
    } else {
      this.selected_restaurant_for_deletion_id_list.push(id);
    }
    console.log('selected_restaurant_for_deletion_id_list', this.selected_restaurant_for_deletion_id_list);
  }

  public toggleRestaurantSelection(id: number): void {
    let index = this.selected_restaurant_id_list.indexOf(id);
    if (index > -1) {
      this.selected_restaurant_id_list.splice(index, 1);
    } else {
      this.selected_restaurant_id_list.push(id);
    }
    console.log(this.selected_restaurant_id_list);
  }

  async removeRestaurants(): Promise<any> {
    // let newList = this.restaurant_list
      //   .map(item => item.id)
      //   .searchDistributor(id => this.selected_restaurant_for_deletion_id_list.indexOf(id) === -1)
      // console.log("New List", newList);
    let data = {
      restaurant_id_list: this.selected_restaurant_for_deletion_id_list,
      distributor_id: this.organization.distributor_id
    }
    let res = await this.callApi(apis.API_DISTRIBUTOR_DELETE_FAVOURITE_RESTAURANTS, data);
    if (res.success) {
      await this.showAwaitableAlert("Success!", "Restaurant(s) removed successfully!")
    } else {
      await this.showAwaitableAlert("Sorry!", "We were unable to remove the restaurant(s). Please contact support.")
    }
    this.selected_restaurant_for_deletion_id_list = [];
    //this.showSearchBar = false;
    await this.getRestaurantList();
    this.searchStringChanged();
  }

  async addRestaurants(): Promise<any> {
    let data = {
      restaurant_id_list: this.selected_restaurant_id_list,
      distributor_id: this.organization.distributor_id
    }
    let res = await this.callApi(apis.API_DISTRIBUTOR_SELECT_RESTAURANTS, data);
    //this.restaurant_search_result = [];
    if (res.success) {
      await this.showAwaitableAlert("Success!", "Restaurant(s) added successfully!")
    } else {
      await this.showAwaitableAlert("Sorry!", "We were unable to add the restaurants(s). Please contact support.")
    }
    this.selected_restaurant_id_list = [];
    //this.showSearchBar = false;
    await this.getRestaurantList();
    this.searchStringChanged();
  }

  async changeZipCode() {
    (await this.alertCtrl.create({
      header: 'Enter Zip Code',
      message: "You can enter multiple zip code separated by comma. e.g 12345, 70098",
      inputs: [
        {
          name: 'zip_code',
          placeholder: 'Zip Code',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            'pass';
          }
        },
        {
          text: 'Search',
          handler: data => {
            let { zip_code } = data;
            if (!zip_code) {
              return this.showAwaitableAlert("Invalid Zip Code", "The zip code you entered is not valid.");
            }
            this.zipCodeList = zip_code.split(',').map((zipCode) => {
              return { zip_code: zipCode.trim() };
            });
            this.searchStringChanged();
            this.selectedTab = 'add';
          }
        }
      ]
    })).present();
  }

  async changeSearchString() {
    (await this.alertCtrl.create({
      header: 'Search Restaurant & Bar',
      message: 'Find establishments that are in your designated zip codes. You can edit the zip codes you want to search for in your settings.',
      inputs: [
        {
          name: 'search_string',
          placeholder: 'Search',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            'pass';
          }
        },
        {
          text: 'Search',
          handler: data => {
            let { search_string } = data;
            if (!search_string) {
              return this.showAwaitableAlert("Invalid Name", "We could not find a match with that name");
            }
            this.search_string = search_string;
            this.searchStringChanged();
            this.selectedTab = 'add';
            this.searchedByString = true;
          }
        }
      ]
    })).present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Search By Zip Code',
          role: 'destructive',
          handler: () => {
            this.changeZipCode()
          }
        },
        {
          text: 'Search By Name',
          role: 'destructive',
          handler: () => {
            this.changeSearchString()
          }
        },

      ]
    });
    actionSheet.present();
  }

  setCheckedStatusInBatch(shouldCheckAll) {
    let nodeList = document.querySelectorAll('.list-of-org');
    if (shouldCheckAll) {
      this.restaurant_list.forEach((restaurant, index) => {
        if (this.selected_restaurant_for_deletion_id_list.indexOf(restaurant.id) === -1) {
          (<any>nodeList[index]).click();
        }
      });
    } else {
      this.restaurant_list.forEach((restaurant, index) => {
        if (this.selected_restaurant_for_deletion_id_list.indexOf(restaurant.id) > -1) {
          (<any>nodeList[index]).click();
        }
      });
    }
  }

  setCheckedStatusInBatchForSearchResults(shouldCheckAll) {
    let nodeList = document.querySelectorAll('.list-of-search-org');
    if (shouldCheckAll) {
      this.restaurant_search_result.forEach((restaurant, index) => {
        if (this.selected_restaurant_id_list.indexOf(restaurant.id) === -1) {
          (<any>nodeList[index]).click();
        }
      });
    } else {
      this.restaurant_search_result.forEach((restaurant, index) => {
        if (this.selected_restaurant_id_list.indexOf(restaurant.id) > -1) {
          (<any>nodeList[index]).click();
        }
      });
    }
  }

  selectAllCurrentRestaurant() {
    if (this.allCurrentOrgSelected) {
      this.setCheckedStatusInBatch(true);
    } else {
      this.setCheckedStatusInBatch(false);
    }
  }
  selectAllSearchRestaurant() {
    if (this.allSearchOrgSelected) {
      this.setCheckedStatusInBatchForSearchResults(true);
    } else {
      this.setCheckedStatusInBatchForSearchResults(false);
    }
  }

  onSegmentChange() {
    this.allCurrentOrgSelected = false;
    this.allSearchOrgSelected = false;

    this.selectAllCurrentRestaurant();
    this.selectAllSearchRestaurant()

  }
}
