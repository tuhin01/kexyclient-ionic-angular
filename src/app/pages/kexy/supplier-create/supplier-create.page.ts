import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController, NavParams } from '@ionic/angular';
import { BasePage } from '../../basePage';
import {Storage} from '@ionic/storage';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { routeConstants } from 'src/common/routeConstants';
import { constants, apis } from '../../../../common/shared';


@Component({
  selector: 'app-supplier-create',
  templateUrl: './supplier-create.page.html',
  styleUrls: ['./supplier-create.page.scss'],
})
export class SupplierCreatePage extends BasePage implements OnInit {
  private readonly params: any;
  private supplierCreateForm: FormGroup;
  private imageUrl = null;
  private supplier_id: number = null;
  private job_title:string = '';


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

    this.supplierCreateForm = new FormGroup({
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
    const control = <FormArray>this.supplierCreateForm.controls.zip_code_list;
    control.push(this.initZipCodeFields());
  }

  public removeZipCode(i: number): void {
    const control = <FormArray>this.supplierCreateForm.controls.zip_code_list;
    control.removeAt(i);
  }

  async supplierCreateFormSubmitted(): Promise<void> {
    if (!this.supplierCreateForm.valid) return;

    let side = this.navParams.get('side');
    //const restaurant_id_list = this.navParams.get('restaurantIdList');

    if (!side) {
      throw new Error("DEV_ERROR: Expected 'side' navParam.");
    }

    let data = {
      side,
      supplier_id: this.supplier_id,
      logo_image: this.imageUrl
    };
    Object.assign(data, this.supplierCreateForm.value);
    let supplier_create_res;
    let supplier_id;
    if (this.supplier_id == null) {
      supplier_create_res = await this.callApi(apis.API_SUPPLIER_CREATE, data);
      supplier_id = supplier_create_res.data.supplier_id;
    } else {
      supplier_create_res = await this.callApi(apis.API_SUPPLIER_EDIT, data);
      supplier_id = this.supplier_id;
    }
    if (!supplier_create_res.success) {
      return;
    }

    await this.storage.remove(constants.IS_INVITED);
    await this.storage.remove(constants.IS_JOIN_TYPE);

    let zip_code_list = (<any>data).zip_code_list;

    this.supplier_id = supplier_id;
    // SUpplier does not need to select Distributor/Rep anymore as told by Scott
    // this.navCtrl.push("CannabisSupplierSetupDistributorPage", {
    //   supplier_id, zip_code_list, side
    // });


    this.navigateTo(routeConstants.KEXY.SUPPLIER_INVITE_EMPLOYEE,{
      supplier_id: this.supplier_id
    });
  }

  public termsClicked(): void {
    this.navigateTo(routeConstants.KEXY.TERMS_AND_CONDITION)
  }

  async presentFileChooser() {
    //TODO-FIX
    // let imageData = await this.takePhoto.presentFileChooser();
    // if (imageData) {
    //   this.imageUrl = imageData;
    // }
  }
}
