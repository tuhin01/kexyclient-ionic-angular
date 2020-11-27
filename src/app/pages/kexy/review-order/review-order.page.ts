import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";

@Component({
  selector: "app-review-order",
  templateUrl: "./review-order.page.html",
  styleUrls: ["./review-order.page.scss"],
})
export class ReviewOrderPage extends BasePage implements OnInit {
  protected params: any;
  public restaurantSide: string = "foh";
  public allowedSide;
  public org: any;
  public user: any;
  public sort: boolean = false;
  public isOrderPage: boolean = false;
  public orderList: any = [];
  public pageType: string = "";

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

  ngOnInit() {
    /**
     * We must initialize everything in ionViewDidEnter() as this is a child of a tabs page
     * It calls ngOnInit() only once in the life of app running instance
     **/
  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.params = params;
      }
    });

    (async () => {
      this.pageType = this.params.pageType;
      this.isOrderPage = this.pageType === "order";
      await this._preparePage();
    })();
  }

  __prepName(name) {
    return name.split("")[0] + ".";
  }

  async _preparePage() {
    this.sort = false;
    this.orderList = [];
    this.org = await this.storage.get(constants.STORAGE_ORGANIZATION);
    this.user = await this.storage.get(constants.STORAGE_USER);
    this.allowedSide = this.org.side.toLowerCase();
    await this.prepareOrderList();
  }

  async prepareOrderList() {
    let res = await this.callApi(
      apis.API_RESTAURANT_GET_ALL_INVENTORY_ORDER,
      {
        restaurant_id: this.org.restaurant_id,
        created_from: "app",
        side: this.restaurantSide.toUpperCase(),
      },
      { shouldBlockUi: true }
    );
    if (!res.success) return;

    this.orderList = res.data.order_list;
    this.orderList = this.orderList.filter((order) => {
      if (this.pageType === "order") {
        return order.created_from_page === constants.ORDER;
      } else {
        return order.created_from_page === constants.INVENTORY;
      }
    });

    console.log("orderList", this.orderList);
  }

  sortProducts() {
    this.sort = !this.sort;
    this.orderList = this.orderList.reverse();
  }

  dateFormat(date) {
    return new Date(date);
  }

  async orderTapped(order) {
    let inventory_id = order.id;
    await this.navigateTo(
      routeConstants.KEXY.RESTAURANT_TABS + "/" + routeConstants.KEXY.FINALIZE_ORDER,
      {
        inventory_id,
        restaurantSide: this.restaurantSide,
        orderStatus: order.order.status,
      }
    );
  }

  async backBtnPressed() {
    // await this.navCtrl.pop();
    await this.setRootWithAnimationBackword(routeConstants.KEXY.RESTAURANT_TABS);
    // this.navCtrl.back({ animated: true, animationDirection: "back" });
  }

  async segmentChanged() {
    let allowedSide = this.org.side.toLowerCase();
    let wasWrong = false;
    if (allowedSide === "foh" && this.restaurantSide === "boh") {
      await this.showAwaitableAlert(
        "Sorry!",
        "You are not authorized to access BOH features. Please contact your account admin to receive access."
      );
      (<any>document.querySelector("#segment1")).click(); // workaround for ionic not switching style
      this.restaurantSide = "foh";
      wasWrong = true;
    }
    if (allowedSide === "boh" && this.restaurantSide === "foh") {
      await this.showAwaitableAlert(
        "Sorry!",
        "You are not authorized to access FOH features. Please contact your account admin to receive access."
      );
      (<any>document.querySelector("#segment2")).click(); // workaround for ionic not switching style
      this.restaurantSide = "boh";
      wasWrong = true;
    }
    if (!wasWrong) {
      await this._preparePage();
    }
  }
}
