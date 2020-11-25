import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingController, AlertController, MenuController, NavController } from "@ionic/angular";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "src/common/routeConstants";
@Component({
  selector: "app-join-request",
  templateUrl: "./join-request.page.html",
  styleUrls: ["./join-request.page.scss"],
})
export class JoinRequestPage extends BasePage implements OnInit {
  public search_string;
  public marketPlaceType: string = "";
  public org_list = [];
  public job_title: string = "";

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  async ngOnInit() {
    this.job_title = await this.storage.get(constants.JOB_TITLE);
  }
  async orgTapped(org) {
    console.log("org", org);
    let data = {
      org_id: org.id,
      join_org_type: this.marketPlaceType,
      job_title: this.job_title,
    };
    let res = await this.callApi(apis.API_JOIN_REQUEST, data);
    if (!res.success) return;

    await this.storage.set(constants.IS_JOIN_TYPE, "request_sent");
    await this.storage.set(constants.JOIN_TO_ORG, org.name);
    await this.setRoot(routeConstants.HOME);
  }

  async createYourOrg(e) {
    e.preventDefault();
    await this.storage.set(constants.IS_JOIN_TYPE, "create_new");
    await this.setRoot(routeConstants.HOME);
    return;
  }

  onOrgTypeChange() {
    this.search_string = "";
    this.org_list = [];
  }

  async searchCanceled() {
    await this.searchStringChanged();
  }

  submitted: boolean = false;
  async searchStringChanged() {
    console.log(this.marketPlaceType);
    if (this.search_string.length === 0 || this.marketPlaceType === "") {
      await this.showAwaitableAlert("Warning!", "Please select company type");
      return;
    }

    let data = {
      search_string: this.search_string,
      org_type: this.marketPlaceType,
    };
    this.submitted = true;
    let res = await this.callApi(apis.API_SEARCH_ORGANIZATIONS, data);
    if (!res.success) return;

    this.org_list = res.data.org_list;
  }
}
