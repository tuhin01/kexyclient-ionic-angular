import { Component, OnInit } from "@angular/core";
import { routeConstants } from "../../../../common/routeConstants";
import { Router } from "@angular/router";

@Component({
  selector: "app-restaurant-tabs",
  templateUrl: "./restaurant-tabs.page.html",
  styleUrls: ["./restaurant-tabs.page.scss"],
})
export class RestaurantTabsPage implements OnInit {
  public restaurantDashboard: string;
  public messagesPage: string;
  public contactsPage: string;
  public placeOrderPage: string;
  public isPlaceOrderSelected: boolean = false;

  constructor(public router: Router) {}

  ngOnInit() {
    this.restaurantDashboard = routeConstants.CANNABIS.RESTAURANT_DASHBOARD;
    this.messagesPage = routeConstants.CANNABIS.MESSAGE;
    this.contactsPage = routeConstants.CANNABIS.ALL_CONTACTS;
    this.placeOrderPage = routeConstants.CANNABIS.PLACE_ORDER;
  }

  async tabClicked(tab: string) {
    if (tab === 'order') {
      this.isPlaceOrderSelected = true;
      await this.router.navigate([
        `${routeConstants.CANNABIS.RESTAURANT_TABS}/${routeConstants.CANNABIS.PLACE_ORDER}`,
      ]);
    } else {
      this.isPlaceOrderSelected = false;
    }
  }
}
