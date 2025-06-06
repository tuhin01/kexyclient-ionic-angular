import { Component } from "@angular/core";

import { IonRouterOutlet, NavController, Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { constants } from "../common/shared";
import { Router } from "@angular/router";
import { routeConstants } from "../common/routeConstants";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  public appType;
  public isRestaurant: boolean;

  public distributorMenuPages: Array<{ title: string; icon: string; url: any; cssClass?: string }>;
  public restaurantMenuPages: Array<{ title: string; icon: string; url: any; cssClass?: string }>;
  public supplierMenuPages: Array<{ title: string; icon: string; url: any; cssClass?: string }>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    public navCtrl: NavController
  ) {
    this.initializeApp();
    this.appType = window.localStorage.getItem(constants.USER_APP_TYEP);
    this.setupSideMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      const keyName = "--kexy--is-dev";
      let isDev = window.localStorage.getItem(keyName);
      let appType = window.localStorage.getItem(constants.USER_APP_TYEP);
      document.getElementById("devModeIndicator").hidden = isDev !== "YES";
      const statusBarBg = appType === constants.RESTAURANT ? "#1a68bd" : "#035e2b";
      if (this.platform.is("cordova")) {
        this.statusBar.backgroundColorByHexString(statusBarBg);
        this.statusBar.styleLightContent();
        this.splashScreen.hide();
      }
    });
  }

  setupSideMenu() {
    let editProfilePage,
      editDistributorPage,
      invitePeoplePage,
      logoutPage,
      distributorDashboardPage,
      editRestaurantPage,
      editSubscriptionPage,
      settingsPage,
      tutorialPage,
      restaurantDashboardPage,
      editSupplierPage,
      supplierDashboardPage;

    if (this.appType === constants.RESTAURANT) {
      this.isRestaurant = true;
      editProfilePage = routeConstants.KEXY.EDIT_PROFILE;
      editDistributorPage = routeConstants.KEXY.EDIT_DISTRIBUTOR;
      invitePeoplePage = routeConstants.KEXY.INVITE_PEOPLE;
      distributorDashboardPage = routeConstants.KEXY.DISTRIBUTOR_DASHBOARD;
      logoutPage = routeConstants.KEXY.LOGOUT;
      editRestaurantPage = routeConstants.KEXY.EDIT_RESTAURANT;
      editSubscriptionPage = routeConstants.KEXY.EDIT_SUPPLIER;
      settingsPage = routeConstants.KEXY.SETTINGS;
      tutorialPage = routeConstants.KEXY.TUTORIAL;
      restaurantDashboardPage = routeConstants.KEXY.RESTAURANT_TABS;
      editSupplierPage = routeConstants.KEXY.EDIT_SUPPLIER;
      supplierDashboardPage = routeConstants.KEXY.SUPPLIER_DASHBOARD;
    } else {
      this.isRestaurant = false;
      editProfilePage = routeConstants.CANNABIS.EDIT_PROFILE;
      editDistributorPage = routeConstants.CANNABIS.EDIT_DISTRIBUTOR;
      invitePeoplePage = routeConstants.CANNABIS.INVITE_PEOPLE;
      distributorDashboardPage = routeConstants.CANNABIS.DISTRIBUTOR_DASHBOARD;
      logoutPage = routeConstants.CANNABIS.LOGOUT;
      editRestaurantPage = routeConstants.CANNABIS.EDIT_RESTAURANT;
      editSubscriptionPage = routeConstants.CANNABIS.EDIT_SUPPLIER;
      settingsPage = routeConstants.CANNABIS.SETTINGS;
      tutorialPage = routeConstants.CANNABIS.TUTORIAL;
      restaurantDashboardPage = routeConstants.CANNABIS.RESTAURANT_TABS;
      editSupplierPage = routeConstants.CANNABIS.EDIT_SUPPLIER;
      supplierDashboardPage = routeConstants.CANNABIS.SUPPLIER_DASHBOARD;
    }

    this.distributorMenuPages = [
      { title: "Edit Profile", icon: "create-outline", url: editProfilePage },
      { title: "Edit Company", icon: "keypad-outline", url: editDistributorPage },
      { title: "Invite People", icon: "people-outline", url: invitePeoplePage },
      { title: "Logout", icon: "log-out-outline", url: logoutPage },
      { title: "Home", icon: "home", url: distributorDashboardPage, cssClass: "home-option" },
    ];

    this.restaurantMenuPages = [
      { title: "Edit Profile", icon: "create-outline", url: editProfilePage },
      { title: "Edit Company", icon: "keypad-outline", url: editRestaurantPage },
      { title: "Invite People", icon: "people-outline", url: invitePeoplePage },
      { title: "Settings", icon: "settings-outline", url: settingsPage },
      { title: "Tutorial Video", icon: "videocam-outline", url: tutorialPage },
      { title: "Logout", icon: "log-out-outline", url: logoutPage },
      { title: "Home", icon: "home", url: restaurantDashboardPage, cssClass: "home-option" },
    ];

    this.supplierMenuPages = [
      { title: "Edit Profile", icon: "create-outline", url: editProfilePage },
      { title: "Edit Company", icon: "keypad-outline", url: editSupplierPage },
      { title: "Logout", icon: "log-out-outline", url: logoutPage },
      { title: "Home", icon: "home", url: supplierDashboardPage, cssClass: "home-option" },
    ];
  }

  async openPage(page) {
    console.log("TDDDD", page.url);
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    await this.navigateTo(page.url);
  }

  async navigateTo(url, params = {}) {
    await this.router.navigate([url], { state: params });
  }

  async setRootWithAnimationForward(url, params = {}) {
    await this.navCtrl.navigateForward(url, {
      animated: true,
      replaceUrl: true,
      animationDirection: "forward",
      state: params,
    });
  }
}
