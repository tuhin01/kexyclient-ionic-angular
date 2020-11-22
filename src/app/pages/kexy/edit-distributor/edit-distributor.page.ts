import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import {apis, constants} from "../../../../common/shared";
// import { HomePage } from '../../home/home.page';
// import { Settings } from 'src/app/model/Settings';
import { routeConstants } from 'src/common/routeConstants';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-edit-distributor',
  templateUrl: './edit-distributor.page.html',
  styleUrls: ['./edit-distributor.page.scss'],
})
export class EditDistributorPage extends BasePage implements OnInit {

  private distributorEditForm: FormGroup;
  private imageUrl: any = null;
  private newImageUploaded = false;
  private orgInfo: any = {}; // TODO model

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private cameraService: CameraService
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this._enableDistributorMenu();
    this.distributorEditForm = new FormGroup({
      side: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      job_title: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(128)
      ])),
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

    this.getCompanyData();
  }
  async getCompanyData(): Promise<any> {
    this.orgInfo = await this.storage.get(constants.STORAGE_ORGANIZATION);
    if (this.orgInfo.logo_image_url) this.imageUrl = this.baseUriForImages + this.orgInfo.logo_image_url;
    console.log(this.orgInfo);
    this.orgInfo.zip_code_list.forEach(list => {
      this.addNewZipCode(list.zip_code);
    });
  }

  private initZipCodeFields(zip_code): FormGroup {
    return this.formBuilder.group({
      zip_code: [zip_code, Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)
      ])]
    });
  }

  public addNewZipCode(zip_code): void {
    const control = <FormArray>this.distributorEditForm.controls.zip_code_list;
    control.push(this.initZipCodeFields(zip_code));
  }

  public removeZipCode(i: number): void {
    const control = <FormArray>this.distributorEditForm.controls.zip_code_list;
    control.removeAt(i);
  }

  async distributorEditFormSubmitted(): Promise<void> {
    if (!this.distributorEditForm.valid) return;

    let data = this.distributorEditForm.value;
    data.distributor_id = this.orgInfo.distributor_id;

    if (this.newImageUploaded) {
      data.logo_image = this.imageUrl;
    }

    let res = await this.callApi(apis.API_DISTRIBUTOR_EDIT, data);
    if (!res.success) return;
    Object.assign(this.orgInfo, res.data.company);
    await this.storage.set(constants.STORAGE_ORGANIZATION, this.orgInfo);
    await this.showAwaitableAlert("Success!", "Your company profile has been updated.");
    // this.navCtrl.setRoot(HomePage);
    this.setRoot(routeConstants.HOME)
  }

  async presentFileChooser() {
    let imageData = await this.cameraService.presentFileChooser();
    if (imageData) {
      this.imageUrl = imageData;
      this.newImageUploaded = true;
    }
  }

}
