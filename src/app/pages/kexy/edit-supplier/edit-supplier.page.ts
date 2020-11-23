import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
// import { CameraService } from 'src/app/services/camera.service';
import { apis, constants } from '../../../../common/shared';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
// import { HomePage } from '../../home/home.page';
import { routeConstants } from 'src/common/routeConstants';
@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.page.html',
  styleUrls: ['./edit-supplier.page.scss'],
})
export class EditSupplierPage extends BasePage implements OnInit {
  supplierEditForm: FormGroup;
  public imageUrl: any = null;
  public newImageUploaded = false;
  public orgInfo: any = {}; // TODO model

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    // private cameraService: CameraService
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this._enableSupplierMenu();

    this.supplierEditForm = new FormGroup({
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
    if (this.orgInfo.logo_image_url) { this.imageUrl = this.baseUriForImages + this.orgInfo.logo_image_url; }
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
    const control = this.supplierEditForm.controls.zip_code_list as FormArray;
    control.push(this.initZipCodeFields(zip_code));
  }

  public removeZipCode(i: number): void {
    const control = this.supplierEditForm.controls.zip_code_list as FormArray;
    control.removeAt(i);
  }

  async supplierEditFormSubmitted(): Promise<void> {
    if (!this.supplierEditForm.valid) { return; }

    const data = this.supplierEditForm.value;
    data.supplier_id = this.orgInfo.supplier_id;

    if (this.newImageUploaded) {
      data.logo_image = this.imageUrl;
    }

    const res = await this.callApi(apis.API_SUPPLIER_EDIT, data);
    if (!res.success) { return; }
    Object.assign(this.orgInfo, res.data.company);
    await this.storage.set(constants.STORAGE_ORGANIZATION, this.orgInfo);
    await this.showAwaitableAlert('Success!', 'Your company profile has been updated.');
    this.setRoot(routeConstants.HOME);

  }

  public openFileDialog(): void {
    (document.querySelector('.company-logo-file-input') as any).click();
  }

  public fileSelected(e: any): void {
    if (e.target.files.length === 0) {
      this.imageUrl = null;
      return;
    }
    const file = e.target.files[0];

    if (file.type.indexOf('image/') !== 0) {
      this.showAwaitableAlert('Invalid Image', 'Please select a valid image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
      this.newImageUploaded = true;
    };
    reader.readAsDataURL(file);
  }
}
