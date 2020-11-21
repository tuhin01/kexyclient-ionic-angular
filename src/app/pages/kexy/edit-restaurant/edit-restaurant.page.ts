import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {apis, constants} from "../../../../common/shared";
import { statesUS } from 'src/assets/statesUS';
import { routeConstants } from 'src/common/routeConstants';
import { CameraService } from "../../../services/camera.service";
interface StatesUS {
  name: string,
  abbreviation: string
}

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.page.html',
  styleUrls: ['./edit-restaurant.page.scss'],
})
export class EditRestaurantPage extends BasePage implements OnInit {
  protected params: any;
  private restaurantEditForm: FormGroup;
  private imageUrl: any = null;
  private newImageUploaded = false;
  private orgInfo: any = {}; // TODO model
  public statesList: Array<StatesUS> = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    private cameraService: CameraService

  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
    
  }

  ngOnInit() {
    this._enableRestaurantMenu();
    this.restaurantEditForm = new FormGroup({
      side: new FormControl('', Validators.compose([
        Validators.required,
      ])),
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
      street_address: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(64)
      ])),
      city: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(21)
      ])),
      state: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(21)
      ])),
      zip_code: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)
      ]))
    });

    this.getStateList();

    this.getCompanyData();
  }
  private getStateList() {
    this.statesList = statesUS;
}

async getCompanyData(): Promise<any> {
  this.orgInfo = await this.storage.get(constants.STORAGE_ORGANIZATION);
  if (this.orgInfo.logo_image_url) this.imageUrl = this.baseUriForImages + this.orgInfo.logo_image_url;
  console.log(this.orgInfo);
}

async restaurantEditFormSubmitted(): Promise<void> {
  if (!this.restaurantEditForm.valid) {
    return;
  }

  let data = this.restaurantEditForm.value;
  data.restaurant_id = this.orgInfo.restaurant_id;

  if (this.newImageUploaded) {
    data.logo_image = this.imageUrl;
  }

  console.log(data);
  let res = await this.callApi(apis.API_RESTAURANT_EDIT, data);
  if (!res.success) {
    return;
  }

  Object.assign(this.orgInfo, res.data.company);
  await this.storage.set(constants.STORAGE_ORGANIZATION, this.orgInfo);
  await this.showAwaitableAlert("Success!", "Your company profile has been updated.");
  this.setRoot(routeConstants.HOME);
}

async presentFileChooser() {
  let imageData = await this.cameraService.presentFileChooser();
  if (imageData) {
    this.imageUrl = imageData;
    this.newImageUploaded = true;
  }
}
}
