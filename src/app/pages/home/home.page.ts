import { Component, OnInit } from "@angular/core";
import { BasePage } from "../basePage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { apis, constants } from "../../../common/shared";
import { Storage } from "@ionic/storage";
import { routeConstants } from "../../../common/routeConstants";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage extends BasePage implements OnInit {
  isAlreadySubscribed: any;
  subscriptionTimestamp: number;

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

    this._route();
  }

  ngOnInit() {
    console.log("ngOnInit HomePage");
  }

  private async _route() {
    //USER_APP_TYEP
    let appType = await window.localStorage.getItem(constants.USER_APP_TYEP);
    console.log({ appType });
    if (!appType) {
      await this.setRoot(routeConstants.APP_SELECT);
      return;
    }

    let loginDecisionPage;
    let loginPage;
    let autoCreatedUserUpdate;
    let joinRequestPage;
    let welcomePage;
    let marketPlaceTypePage;
    let restaurantTabsPage;
    let distributorDashboardPage;
    let supplierDashboardPage;
    if (appType === constants.RESTAURANT) {
      loginDecisionPage = routeConstants.KEXY.LOGIN_DICISION;
      loginPage = routeConstants.KEXY.LOGIN;
      autoCreatedUserUpdate = routeConstants.KEXY.AUTO_CREATED_USER_UPDATE;
      joinRequestPage = routeConstants.KEXY.JOIN_REQUEST;
      welcomePage = routeConstants.KEXY.WELCOME;
      marketPlaceTypePage = routeConstants.KEXY.MARKETPLACE_TYPE;
      restaurantTabsPage = routeConstants.KEXY.RESTAURANT_TABS;
      distributorDashboardPage = routeConstants.KEXY.DISTRIBUTOR_DASHBOARD;
      supplierDashboardPage = routeConstants.KEXY.SUPPLIER_DASHBOARD;
    } else {
      loginDecisionPage = routeConstants.CANNABIS.LOGIN_DICISION;
      loginPage = routeConstants.CANNABIS.LOGIN;
      autoCreatedUserUpdate = routeConstants.CANNABIS.AUTO_CREATED_USER_UPDATE;
      joinRequestPage = routeConstants.CANNABIS.JOIN_REQUEST;
      welcomePage = routeConstants.CANNABIS.WELCOME;
      marketPlaceTypePage = routeConstants.CANNABIS.MARKETPLACE_TYPE;
      restaurantTabsPage = routeConstants.CANNABIS.RESTAURANT_TABS;
      distributorDashboardPage = routeConstants.CANNABIS.DISTRIBUTOR_DASHBOARD;
      supplierDashboardPage = routeConstants.CANNABIS.SUPPLIER_DASHBOARD;
    }

    let user = await this.storage.get(constants.STORAGE_USER);
    let isJoinType = await this.storage.get(constants.IS_JOIN_TYPE);
    let isInvited = await this.storage.get(constants.IS_INVITED);
    console.log("Current User", user);
    console.log("Join Type", isJoinType);
    console.log("Is Invited", isInvited);

    if (!user) {
      await this.setRoot(loginDecisionPage);
      return;
    }

    if (!user.is_claimed) {
      await this.setRoot(autoCreatedUserUpdate);
      return;
    }

    // If user got no invitation but wants to join to his/her org.
    if (isJoinType === "join" && !isInvited) {
      await this.setRoot(joinRequestPage);
      return;
    }

    if (!this.isAlreadySubscribed) {
      const newMessagePopupThreshold = 3000;
      this.isAlreadySubscribed = true;
      this.subscriptionTimestamp = Date.now();
    }

    let res = await this.callApi(apis.API_USER_GET_USER_ORGANIZATIONS, {});
    if (!res.success) return;
    let organizationList = [].concat(
      res.data.restaurant_list,
      res.data.distributor_list,
      res.data.supplier_list
    );
    if (organizationList.length === 0) {
      if (isJoinType !== "create_new") {
        let joinRequest = await this.callApi(
          apis.API_CHECK_JOIN_REQUEST,
          {},
          { shouldBlockUi: false }
        );
        if (!joinRequest.success) return;
        if (joinRequest.data.request) {
          if (joinRequest.data.request.status !== "accepted") {
            await this.storage.set(constants.IS_JOIN_TYPE, "request_sent");
            await this.setRoot(welcomePage);
            return;
          }
        }
      }
      await this.setRoot(marketPlaceTypePage);
      return;
    }
    let org = organizationList.shift();
    if (organizationList.length > 1) {
      await this.showAwaitableAlert(
        "Warning!",
        "You are a member of more than one organizations. Currently we support only one organization per user. The first organization will automatically be selected."
      );
    }

    if (org.status !== "active") {
      await this.showAwaitableAlert(
        "Warning!",
        "Your account access has been removed. Please contact your company."
      );
      await this.removeLocalUserData();
      await this.setRoot(loginPage);
      return;
    }

    if (org.type === constants.ORGANIZATION_TYPE_RESTAURANT) {
      org.id = org.restaurant_id;
    } else if (org.type === constants.ORGANIZATION_TYPE_DISTRIBUTOR) {
      org.id = org.distributor_id;
    } else {
      org.id = org.supplier_id;
    }
    await this.storage.set(constants.STORAGE_ORGANIZATION, org);

    // Remove these 2 from local storage here as they are no longer necessary and keeping them will cause issue
    await this.storage.remove(constants.IS_JOIN_TYPE);
    await this.storage.remove(constants.IS_INVITED);

    if (org.type === constants.ORGANIZATION_TYPE_RESTAURANT) {
      let settings = await this.callApi(
        apis.API_GET_USER_SETTINGS,
        { restaurant_id: org.restaurant_id },
        { shouldBlockUi: false }
      );
      console.log(res);
      if (settings.data.settings) {
        await this.storage.set(constants.USER_SETTINGS, settings.data.settings);
      } else {
        await this.storage.set(constants.USER_SETTINGS, {
          par_level_update: true,
          restaurant_id: 0,
        });
      }
      await this.setRoot(restaurantTabsPage);
      return;
    } else if (org.type === constants.ORGANIZATION_TYPE_DISTRIBUTOR) {
      await this.setRoot(distributorDashboardPage);
      return;
    } else {
      await this.setRoot(supplierDashboardPage);
      return;
    }
  }
}
