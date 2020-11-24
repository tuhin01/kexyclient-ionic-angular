import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";
import { CameraService } from "../../../services/camera.service";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"],
})
export class EditProfilePage extends BasePage implements OnInit {
  private emailBackup = null;
  private phoneBackup = null;
  private newImageUploaded = false;

  primaryForm: FormGroup;
  imageUrl: any = null;
  userInfo: any = {
    first_name: "",
    last_name: "",
    phone: "",
    job_title: "",
    email: "",
    logo_image_url: "",
  };
  orgInfo: any = {};

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
    this.primaryForm = new FormGroup({
      first_name: new FormControl(
        this.userInfo.first_name,
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(64),
          Validators.pattern("^[a-zA-Z- ]+$"),
        ])
      ),
      last_name: new FormControl(
        this.userInfo.last_name,
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(64),
          Validators.pattern("^[a-zA-Z- ]+$"),
        ])
      ),
      phone: new FormControl(
        this.userInfo.phone,
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(21),
          Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
        ])
      ),
      job_title: new FormControl(
        this.orgInfo.job_title,
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(128),
        ])
      ),
      email: new FormControl(
        this.userInfo.email,
        Validators.compose([Validators.required, Validators.email])
      ),
    });

    this.getUserData();
  }

  async getUserData(): Promise<any> {
    this.userInfo = await this.storage.get(constants.STORAGE_USER);
    this.orgInfo = await this.storage.get(constants.STORAGE_ORGANIZATION);
    this.emailBackup = this.userInfo.email;
    this.phoneBackup = this.userInfo.phone;

    if (this.userInfo.logo_image_url)
      this.imageUrl = this.baseUriForImages + this.userInfo.logo_image_url;
    console.log(this.userInfo);

    this.primaryForm.setValue({
      first_name: this.userInfo.first_name,
      last_name: this.userInfo.last_name,
      email: this.userInfo.email,
      phone: this.userInfo.phone,
      job_title: this.orgInfo.job_title,
    });
  }

  async changePassword() {
    console.log("Change pass was clicked!");
    const prompt = await this.alertCtrl.create({
      header: "Change Password",
      message: "",
      inputs: [
        {
          name: "current_password",
          placeholder: "Your current password",
          type: "password",
        },
        {
          name: "new_password",
          placeholder: "New password",
          type: "password",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          handler: (data) => {
            //'pass';
            console.log("Cancel");
          },
        },
        {
          text: "Save",
          handler: async (data) => {
            console.log("SAVE");
            await this.changePasswordApiCalled(data);
          },
        },
      ],
    });
    await prompt.present();
  }

  async changePasswordApiCalled(data) {
    let res = await this.callApi(apis.API_USER_CHANGE_PASSWORD, data);
    if (!res.success) return;
    await this.showAwaitableAlert("Success", res.data.message);
  }

  async primaryFormSubmitted(): Promise<any> {
    if (!this.primaryForm.valid) return;

    let companyData: any = {};
    let form = this.primaryForm.value;
    if (this.newImageUploaded) {
      form.profile_photo = this.imageUrl;
    }
    companyData.job_title = form.job_title;

    delete form.job_title;
    console.log(companyData);
    form.phone = form.phone.replace(/\D/g, "");

    // If phone number is not changed then do not send it to server
    if (form.phone === this.phoneBackup) {
      delete form.phone;
    }

    // If email address is not changed then do not send it to server
    if (form.email === this.emailBackup) {
      delete form.email;
    }

    let res = await this.callApi(apis.API_USER_EDIT_PROFILE, form);
    if (!res.success) return;

    if (this.orgInfo.restaurant_id != null) {
      companyData.restaurant_id = this.orgInfo.restaurant_id;
      let res2 = await this.callApi(apis.API_RESTAURANT_EDIT, companyData);
      if (!res2.success) {
        return;
      }
    } else if (this.orgInfo.distributor_id != null) {
      companyData.distributor_id = this.orgInfo.distributor_id;
      let res2 = await this.callApi(apis.API_DISTRIBUTOR_EDIT, companyData);
      if (!res2.success) {
        return;
      }
    } else {
      companyData.supplier_id = this.orgInfo.supplier_id;
      let res2 = await this.callApi(apis.API_SUPPLIER_EDIT, companyData);
      if (!res2.success) {
        return;
      }
    }

    Object.assign(this.userInfo, res.data.user);
    console.log(this.userInfo);
    await this.storage.set(constants.STORAGE_USER, this.userInfo);
    await this.showAwaitableAlert("Success!", "Your profile has been updated.");
    await this.setRoot(routeConstants.CANNABIS.RESTAURANT_TABS);
  }

  async presentFileChooser() {
    let imageData = await this.cameraService.presentFileChooser();
    if (imageData) {
      this.imageUrl = imageData;
      this.newImageUploaded = true;
    }
  }
}
