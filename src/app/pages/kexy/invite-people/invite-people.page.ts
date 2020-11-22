import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import {apis, constants} from "../../../../common/shared";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { routeConstants } from 'src/common/routeConstants';

@Component({
  selector: 'app-invite-people',
  templateUrl: './invite-people.page.html',
  styleUrls: ['./invite-people.page.scss'],
})
export class InvitePeoplePage extends BasePage implements OnInit {
  protected params: any;
  private organization;
  private segmentChangeCount = 0;
  employee_invitation_list = [];
  private org_invitation_list = [];
  employeeForm: FormGroup;
  private organizationInviteForm: FormGroup;
  private is_distributor: boolean = false;
  private is_restaurant: boolean = false;
  private is_supplier: boolean = false;
  public selectedTab: string = "employee";
  
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

  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
    
  }

  ngOnInit() {
    this.employeeForm = new FormGroup({
      invited_employee_list: this.formBuilder.array([])
    });
    this.organizationInviteForm = new FormGroup({
      invited_email_list: this.formBuilder.array([])
    });
    this.addNewInvite();

    (async () => {

      this.organization = await this.storage.get(constants.STORAGE_ORGANIZATION);
      if (this.organization.type == 'distributor') {
        this.is_distributor = true;
      } else if (this.organization.type == 'restaurant') {
        this.is_restaurant = true;
      } else {
        this.is_supplier = true;
      }

      await this.getInvitationList();

    })();
  }
 async getInvitationList(blockUi = true) {
    let data = {
      'restaurant_id': '',
      'distributor_id': '',
      'supplier_id': '',
    };
    if (this.organization.type == 'distributor') {
      this.is_distributor = true;
      data.distributor_id = this.organization.distributor_id;
    } else if (this.organization.type == 'restaurant') {
      this.is_restaurant = true;
      data.restaurant_id = this.organization.restaurant_id;
    } else {
      this.is_supplier = true;
      data.supplier_id = this.organization.supplier_id;
    }
    let res = await this.callApi(apis.API_GET_LIST_INVITED_USER, data, {shouldBlockUi: blockUi});
    if (!res.success) {
      return;
    }
    this.employee_invitation_list = res.data.employee;
    this.org_invitation_list = res.data.organization;
  }



  private initInviteFields(): FormGroup {
    let formControlConfig = {
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.email
      ])]
    };

    if (this.selectedTab == 'employee') {
      Object.assign(formControlConfig, {
        role: ['manager', Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(36)
        ])]
      })
    }

    return this.formBuilder.group(formControlConfig);
  }

  public addNewInvite(): void {
    let control = this._inviteControlsUpdate();
    control.push(this.initInviteFields());

  }

  public removeInvite(i: number): void {
    let control = this._inviteControlsUpdate();
    control.removeAt(i);
  }

  private _inviteControlsUpdate() {
    let control;
    if (this.selectedTab == 'employee') {
      control = <FormArray>this.employeeForm.controls.invited_employee_list;
    } else {
      control = <FormArray>this.organizationInviteForm.controls.invited_email_list;
    }
    return control;
  }

  async resendEmployeeInvitation(invitation) {
    console.log(invitation);
    let data = {};
    let API_URL: any;
    if (this.is_distributor) {
      data = {distributor_id: this.organization.distributor_id};
      API_URL = apis.API_DISTRIBUTOR_INVITE_EMPLOYEES;
    } else if (this.is_restaurant) {
      data = {
        restaurant_id: this.organization.restaurant_id,
      };
      API_URL = apis.API_RESTAURANT_INVITE_EMPLOYEES;
    } else {
      data = {supplier_id: this.organization.supplier_id};
      API_URL = apis.API_SUPPLIER_INVITE_EMPLOYEES;
    }
    Object.assign(data, {'resend': true, invited_employee_list: invitation});
    let res = await this.callApi(API_URL, data);
    if (!res.success) {
      return;
    }
    await this.showAwaitableAlert("Success!", "Invitations sent successfully.");
  }

  async employeeFormSubmitted(): Promise<void> {
    if (!this.employeeForm.valid) return;

    let data = {};
    let API_URL: any;
    if (this.is_distributor) {
      data = {distributor_id: this.organization.distributor_id};
      API_URL = apis.API_DISTRIBUTOR_INVITE_EMPLOYEES;
    } else if (this.is_restaurant) {
      data = {restaurant_id: this.organization.restaurant_id};
      API_URL = apis.API_RESTAURANT_INVITE_EMPLOYEES;
    } else {
      data = {supplier_id: this.organization.supplier_id};
      API_URL = apis.API_SUPPLIER_INVITE_EMPLOYEES;
    }

    Object.assign(data, this.employeeForm.value);

    if ((<any>data).invited_employee_list.length === 0) {
      return;
    }
    let res = await this.callApi(API_URL, data);
    if (!res.success) {
      return;
    }
    await this.showAwaitableAlert("Success!", "Invitations sent successfully.");
    await this.getInvitationList(false);
    this.employeeForm.reset();
  }

  async resendOrgInvitation(invitation) {
    let invite_list = [invitation.email];
    let data = {};
    let API_URL: any;
    if (this.is_distributor) {
      data = {
        distributor_id: this.organization.distributor_id,
        invited_restaurant_email_list: invite_list
      };
      API_URL = apis.API_DISTRIBUTOR_INVITE_RESTAURANTS;
    } else if (this.is_restaurant) {
      data = {
        restaurant_id: this.organization.restaurant_id,
        invited_distributor_email_list: invite_list
      };
      API_URL = apis.API_RESTAURANT_INVITE_DISTRIBUTORS;
    }
    Object.assign(data, {'resend': true});
    let res = await this.callApi(API_URL, data);
    if (!res.success) {
      return;
    }

    await this.showAwaitableAlert("Success!", "Invitations sent successfully.");
  }

  async organizationInviteFormSubmitted(): Promise<void> {
    if (!this.organizationInviteForm.valid) return;
    let invite_list = [];
    let email_list = {invited_email_list: undefined};
    let data = {};
    let API_URL: any;
    Object.assign(email_list, this.organizationInviteForm.value);
    if (email_list.invited_email_list.length > 0) {
      email_list.invited_email_list.forEach(function (invite) {
        invite_list.push(invite.email)
      })
    }

    if (invite_list.length === 0) {
      return;
    }

    if (this.is_distributor) {
      data = {
        distributor_id: this.organization.distributor_id,
        invited_restaurant_email_list: invite_list
      };
      API_URL = apis.API_DISTRIBUTOR_INVITE_RESTAURANTS;
    } else if (this.is_restaurant) {
      data = {
        restaurant_id: this.organization.restaurant_id,
        invited_distributor_email_list: invite_list
      };
      API_URL = apis.API_RESTAURANT_INVITE_DISTRIBUTORS;
    }

    let res = await this.callApi(API_URL, data);
    if (!res.success) {
      return;
    }

    await this.showAwaitableAlert("Success!", "Invitations sent successfully.");
    await this.getInvitationList(false);
    this.organizationInviteForm.reset();
  }

  public trashedTapped(i: number) {
    this.removeInvite(i);
  }


  async onSegemntChange() {
    ++this.segmentChangeCount;
    if (this.segmentChangeCount == 1) {
      this.addNewInvite();
    }
  }

  requestsToJoin() {

    this.navigateTo(routeConstants.KEXY.JOIN_REQUEST_LIST)
    // this.navCtrl.push('JoinRequestListPage');
  }
}
