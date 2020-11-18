import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController, NavParams } from '@ionic/angular';
import { BasePage } from '../../basePage';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { constants, apis } from '../../../../common/shared';

import { TermsAndConditionsPage } from '../terms-and-conditions/terms-and-conditions.page';
import { routeConstants } from 'src/common/routeConstants';

@Component({
  selector: 'app-distributor-create',
  templateUrl: './distributor-create.page.html',
  styleUrls: ['./distributor-create.page.scss'],
})
export class DistributorCreatePage extends BasePage implements OnInit {
  private readonly params: any;
  private distributorCreateForm: FormGroup;
  private imageUrl = null;
  private distributor_id: number = null;
  private job_title: string = '';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    // public takePhoto: TakePhotoProvider,
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
    if (this.router.getCurrentNavigation().extras.state) {
      this.params = this.router.getCurrentNavigation().extras.state;
    }
  }

  async ngOnInit() {
    this._disableMenu();

    this.distributorCreateForm = new FormGroup({
      // job_title: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.minLength(0),
      //   Validators.maxLength(128)
      // ])),
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(64)
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(21),
        Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
      ])),
      zip_code_list: this.formBuilder.array([])
    });
    this.addNewZipCode();
    this.job_title = await this.storage.get(constants.JOB_TITLE);
  }


  private initZipCodeFields(): FormGroup {
    return this.formBuilder.group({
      zip_code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)
      ])]
    });
  }

  public addNewZipCode(): void {
    const control = <FormArray>this.distributorCreateForm.controls.zip_code_list;
    control.push(this.initZipCodeFields());
  }

  public removeZipCode(i: number): void {
    const control = <FormArray>this.distributorCreateForm.controls.zip_code_list;
    control.removeAt(i);
  }

  async distributorCreateFormSubmitted(): Promise<void> {
    if (!this.distributorCreateForm.valid) return;

    let side = this.navParams.get('side');
    const restaurant_id_list = this.navParams.get('restaurantIdList');

    if (!side) {
      throw new Error("DEV_ERROR: Expected 'side' navParam.");
    }

    let data = {
      side,
      distributor_id: this.distributor_id,
      logo_image: this.imageUrl,
      job_title: this.job_title,
    };
    Object.assign(data, this.distributorCreateForm.value);
    let distributor_create_res;
    let distributor_id;
    if (this.distributor_id === null) {
      distributor_create_res = await this.callApi(apis.API_DISTRIBUTOR_CREATE, data);
      distributor_id = distributor_create_res.data.distributor_id;
    } else {
      distributor_create_res = await this.callApi(apis.API_DISTRIBUTOR_EDIT, data);
      distributor_id = this.distributor_id;
    }

    if (!distributor_create_res.success) {
      return;
    }

    // Required for JOIN flow
    let zip_code_list = (<any>data).zip_code_list;
    if (restaurant_id_list && restaurant_id_list.length) {
      let selected_restaurant_data = { restaurant_id_list, distributor_id }
      let selected_restaurant_res = await this.callApi(apis.API_DISTRIBUTOR_SELECT_RESTAURANTS, selected_restaurant_data);
      console.log(selected_restaurant_res);
    }

    await this.storage.remove(constants.IS_INVITED);
    await this.storage.remove(constants.IS_JOIN_TYPE);

    this.distributor_id = distributor_id;

    this.navigateTo(routeConstants.KEXY.DISTRIBUTOR_SETUP_RESTAURANT_BAR,{
      distributor_id, zip_code_list, side
    })
 
  }

  async presentFileChooser() {

    //TODO -Fix
    // let imageData = await this.takePhoto.presentFileChooser();
    // if (imageData) {
    //   this.imageUrl = imageData;
    // }
  }

  async termsClicked() {
    await this.navigateTo(routeConstants.KEXY.TERMS_AND_CONDITION)
  }

}
