import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { BasePage } from '../../basePage';
import { Storage } from '@ionic/storage';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { apis } from 'src/common/shared';
import { HomePage } from '../../home/home.page';
import { routeConstants } from 'src/common/routeConstants';

@Component({
  selector: 'app-supplier-invite-employee',
  templateUrl: './supplier-invite-employee.page.html',
  styleUrls: ['./supplier-invite-employee.page.scss'],
})
export class SupplierInviteEmployeePage extends BasePage implements OnInit {
  private readonly params: any;
  private supplier_id;
  primaryForm;
  from_page: string = null;

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
    if (this.router.getCurrentNavigation().extras.state) {
      this.params = this.router.getCurrentNavigation().extras.state;
    }
  }

  ngOnInit() {
    this._disableMenu();

    this.supplier_id = this.params.supplier_id;
    this.from_page = this.params.from_page;
    this.primaryForm = new FormGroup({
      invited_employee_list: this.formBuilder.array([])
    });
    this.addNewInvite();
  }
  private initInviteFields(): FormGroup {
    return this.formBuilder.group({
      role: ['manager', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(36)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(0),
        Validators.email
      ])]
    });
  }

  public addNewInvite(): void {
    const control = <FormArray>this.primaryForm.controls.invited_employee_list;
    control.push(this.initInviteFields());
  }

  public removeInvite(i: number): void {
    const control = <FormArray>this.primaryForm.controls.invited_employee_list;
    control.removeAt(i);
  }

  public skipForNowBtnTapped(): void {
    if (this.from_page) {
      this.setRoot(routeConstants.HOME)
      return;
    }
    this.setRoot(routeConstants.CANNABIS.WELCOME, {
      supplier_id: this.supplier_id
    });
  }

  async primaryFormSubmitted(): Promise<void> {
    if (!this.primaryForm.valid) return;
    let data = {
      supplier_id: this.supplier_id
    };
    Object.assign(data, this.primaryForm.value);

    if ((<any>data).invited_employee_list.length === 0) {
      this.skipForNowBtnTapped();
      return;
    }
    let res = await this.callApi(apis.API_SUPPLIER_INVITE_EMPLOYEES, data);
    if (!res.success) return;

    this.skipForNowBtnTapped();
  }

  public trashedTapped(i: number): void {

    //TODO-Fix
    
    // const confirm = this.alertCtrl.create({
    //   title: 'Are you sure?',
    //   message: 'Not interested to send invitation to this email address?',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: () => {
    //         'pass'
    //       }
    //     },
    //     {
    //       text: 'Delete',
    //       handler: () => {
    //         this.removeInvite(i);
    //       }
    //     }
    //   ]
    // });
    // confirm.present();
  }
}
