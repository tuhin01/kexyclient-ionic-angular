import { Component, OnInit } from '@angular/core';
import { routeConstants } from "../../../../common/routeConstants";

@Component({
  selector: 'app-restaurant-tabs',
  templateUrl: './restaurant-tabs.page.html',
  styleUrls: ['./restaurant-tabs.page.scss'],
})
export class RestaurantTabsPage implements OnInit {

  public restaurantDashboard: string;
  public messagesPage: string;
  public contactsPage: string;
  public placeOrderPage: string;

  constructor() { }

  ngOnInit() {
    this.restaurantDashboard = routeConstants.KEXY.RESTAURANT_DASHBOARD;
    this.messagesPage = "kexy-restaurant-message";
    this.contactsPage = "kexy-restaurant-message";
    this.placeOrderPage = routeConstants.KEXY.PLACE_ORDER;
  }

}
