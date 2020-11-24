import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { BasePage } from '../../basePage';
import { Storage } from '@ionic/storage';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routeConstants } from 'src/common/routeConstants';
import { apis } from 'src/common/shared';
@Component({
  selector: 'app-invite-distributor-employee',
  templateUrl: './invite-distributor-employee.page.html',
  styleUrls: ['./invite-distributor-employee.page.scss'],
})
export class InviteDistributorEmployeePage extends BasePage implements OnInit {
  private readonly params: any;
  public role: string;
  primaryForm: FormGroup;
  private distributor_id;
   from_page: string = null;
  private showHeader: boolean = true;

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
    this.distributor_id = this.params.distributor_id; // TODO
    this.from_page = this.params.from_page;
    this.primaryForm = new FormGroup({
      invited_employee_list: this.formBuilder.array([])
    });
    this.addNewInvite();

    if (this.from_page !== 'my_restaurant') {
      this._disableMenu();
    }
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
    this.navigateTo(routeConstants.KEXY.WELCOME, {
      distributor_id: this.distributor_id
    });
  }

  async primaryFormSubmitted(): Promise<void> {
    if (!this.primaryForm.valid) return;
    let data = {
      distributor_id: this.distributor_id
    };
    Object.assign(data, this.primaryForm.value);

    if ((<any>data).invited_employee_list.length === 0) {
      this.skipForNowBtnTapped();
      return;
    }
    let res = await this.callApi(apis.API_DISTRIBUTOR_INVITE_EMPLOYEES, data);
    if (!res.success) {
      return;
    }
    await this.showAwaitableAlert("Success!", "Invitations sent successfully.");
    this.skipForNowBtnTapped()
  }

  public trashedTapped(i: number) {
    this.removeInvite(i);
  }
}
