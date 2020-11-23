import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { Settings } from "../../../model/Settings";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";
import { NodeSocketService } from "../../../services/node-socket.service";

@Component({
  selector: "app-finalize-order",
  templateUrl: "./finalize-order.page.html",
  styleUrls: ["./finalize-order.page.scss"],
})
export class FinalizeOrderPage extends BasePage implements OnInit {
  protected params: any;
  public restaurantSide: string = "foh";
  public orderStatus: string = "";
  public orderType: string = "";
  public title: string = "Finalize Order";
  public submitButtonText: string = "SUBMIT ORDER";
  public addProductBtnText: string = "Add Products";
  org: any;
  user: any;
  inventory_id: any;
  inventory: any;
  should_order_all = false;
  isInEditMode: boolean = false;
  settings: Settings = null;
  order_all: boolean = false;
  customMetrics: any;
  public currentUser;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    private nodeSocket: NodeSocketService
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.params = params;
      }
    });

    this.currentUser = await this.storage.get(constants.STORAGE_USER);
    this.nodeSocket.setUserId(this.currentUser.id);
    (<any>window).openedConversationIdAndTimestampList = [];
    this.nodeSocket.event("new-conversation-created").subscribe((conversation) => {
      let entry = (<any>window).openedConversationIdAndTimestampList.find((entry) => {
        return entry.conversation_id === conversation.id && Date.now() - entry.timestamp < 1000;
      });
      if (!entry) {
        (<any>window).openedConversationIdAndTimestampList.push({
          conversation_id: conversation.id,
          timestamp: Date.now(),
        });

        if (this.loadingDialog) {
          this.loadingDialog.dismiss();
          this.loadingDialog = null;
        }
        this.navigateTo(routeConstants.KEXY.MESSAGE_CONV, { conversation: JSON.stringify(conversation) });
      }
    });
  }

  ionViewDidEnter() {
    (async () => {
      await this._preparePage();
    })();
  }

  ionViewWillLeave() {
    if (this.loadingDialog) {
      this.loadingDialog.dismiss();
      this.loadingDialog = null;
    }
  }

  __prepName(name) {
    return name.split("")[0] + ".";
  }

  async _preparePage() {
    this.org = await this.storage.get(constants.STORAGE_ORGANIZATION);
    this.user = await this.storage.get(constants.STORAGE_USER);
    let inventory_id = this.params.inventory_id;
    if (inventory_id === null || typeof inventory_id === "undefined") {
      await this.setRoot(routeConstants.KEXY.RESTAURANT_TABS);
      return;
    }
    this.restaurantSide = this.params.restaurantSide;
    this.orderStatus = this.params.orderStatus;
    this.orderType = this.params.type;
    if (this.orderStatus === "finalized") {
      this.title = "Review Order";
    }
    this.inventory_id = inventory_id;
    await this.prepareInventoryAndOrderSummary();
  }

  async restructureInventory(inventory) {
    console.log("restructureInventory called");
    let distributorMap = {};
    inventory.product_category_list.forEach((product_category) => {
      product_category.product_list.forEach((product) => {
        let id = product.product.distributor.id;
        distributorMap[id] = {
          isSent: false,
          isUncheckable: true,
          distributor: product.product.distributor,
          distributor_employee: product.product.employee,
        };
      });
    });
    let distributorList = Object.keys(distributorMap).map((key) => distributorMap[key]);

    distributorList.forEach((distributor) => {
      distributor.product_category_map = {};
      inventory.product_category_list.forEach((product_category) => {
        product_category.product_list.forEach((product) => {
          if (product.product.distributor.id === distributor.distributor.id) {
            if (!(product_category.id in distributor.product_category_map)) {
              let { id, name, category_photo } = product_category;
              distributor.product_category_map[product_category.id] = {
                id,
                name,
                category_photo,
                product_list: [],
              };
            }
            distributor.product_category_map[product_category.id].product_list.push(product);
          }
        });
      });
      distributor.product_category_list = Object.keys(distributor.product_category_map).map(
        (key) => distributor.product_category_map[key]
      );
      if (distributor.distributor.name.toLowerCase().indexOf("distributor_fk") > -1) {
        distributor.distributor.name = "Distributor Unknown";
      }
    });
    inventory.distributorList = distributorList;

    if (inventory.order) {
      if (inventory.order.sent_to_distributor_id_list === "") {
        inventory.order.sent_to_distributor_id_list = [];
      }
      distributorList.forEach((distributor) => {
        if (inventory.order.sent_to_distributor_id_list.indexOf(distributor.distributor.id) > -1) {
          distributor.isSent = true;
          if (inventory.order.status === "finalized") {
            distributor.isUncheckable = false;
          }
        }
      });
    } else {
      distributorList.forEach((distributor) => {
        distributor.isSent = true;
      });
    }

    const isOrderAll = distributorList.filter((distributor) => distributor.isSent === false);
    if (isOrderAll.length === 0) {
      this.order_all = true;
    }

    return inventory;
  }

  async productAmountToOrderChanged(product) {
    let last_par_level = parseInt(String(product.product.last_par_level));
    let total_qty_in_house = parseInt(String(product.total_qty_in_house));
    let amount_to_order = parseInt(String(product.amount_to_order));
    let total_qty_will_be_in_house = amount_to_order + total_qty_in_house;

    if (this.settings && this.settings.par_level_update) {
      if (total_qty_will_be_in_house > last_par_level && last_par_level > 0) {
        await this.showParChangeAlert(total_qty_will_be_in_house, product.product_id);
      }
    }
  }

  public nameToInitials(name) {
    let nameArr = name.split(" ");
    let first_name = nameArr[0];
    let last_name = nameArr[1];
    return (first_name.charAt(0) + last_name.charAt(0)).toUpperCase();
  }

  async showParChangeAlert(total_qty_will_be_in_house, product_id) {
    const confirm = await this.alertCtrl.create({
      header: "Par level change?",
      message:
        "Looks like you're ordering more than your par level.  Do you want to change your par level to " +
        total_qty_will_be_in_house +
        "?",
      buttons: [
        {
          text: "No",
          handler: () => {},
        },
        {
          text: "Yes",
          handler: async () => {
            let res = await this.callApi(
              apis.API_RESTAURANT_EDIT_PRODUCT,
              {
                last_par_level: total_qty_will_be_in_house,
                product_id: product_id,
              },
              { shouldBlockUi: true }
            );
            if (!res.success) {
              await this.showAwaitableAlert("Sorry!", "Something went wrong. Try again later");
            } else {
              await this.showAwaitableAlert("Success!", res.data.message);
            }
          },
        },
      ],
    });
    await confirm.present();
  }

  async prepareInventoryAndOrderSummary() {
    let res = await this.callApi(
      apis.API_RESTAURANT_GET_INVENTORY_SUMMARY_LIST,
      {
        restaurant_id: this.org.restaurant_id,
        side: this.restaurantSide.toUpperCase(),
        inventory_id: this.inventory_id,
        month: "xx",
        year: "xx",
      },
      { shouldBlockUi: true }
    );
    if (!res.success) return;
    let inventory_list = res.data.inventory_list;
    this.customMetrics = res.data.custom_metric_list;
    this.inventory = await this.restructureInventory(inventory_list[0]);
    let createdFromPage = this.inventory.created_from_page;
    if (createdFromPage === "inventory" && this.orderType != "orderCreate") {
      this.title = "Review Inventory";
      this.addProductBtnText = "Continue Inventory";
      this.submitButtonText = "CREATE ORDER";
    } else if (createdFromPage == "inventory" && this.orderType == "orderCreate") {
      this.title = "Finalize Order";
      this.submitButtonText = "SUBMIT ORDER";
      this.addProductBtnText = "Add Products";
    }

    // If it's an order and not inventiry only then call for confirmed status.
    if (this.inventory.order != "") {
      await this.getDistributorOrderStatus();
    }
  }

  async getDistributorOrderStatus() {
    let result = await this.callApi(
      apis.API_ORDER_CONFIRMED_DISTRIBUTOR_LIST,
      {
        order_id: this.inventory.order.id,
      },
      { shouldBlockUi: false }
    );
    if (!result.success) return;
    let oderConfirmDistributorList = result.data.distributor_list;

    this.inventory.distributorList.forEach((distributor) => {
      distributor.isOderConfirmed = "";
      oderConfirmDistributorList.forEach((distributorConfirmed) => {
        if (distributor.distributor.id == distributorConfirmed.distributor_id) {
          distributor.isOderConfirmed = "(" + distributorConfirmed.status + ")";
        }
      });
    });
  }

  dateFormat(date) {
    return new Date(date);
  }

  orderAllTapped() {
    console.log("orderAllTapped Called");
    this.inventory.distributorList.forEach((distributor) => {
      console.log({ distributor });
      if (distributor.isUncheckable) {
        distributor.isSent = true;
      }
    });
    this.order_all = true;
    this.should_order_all = true;
  }

  uncheckAllOrder() {
    this.inventory.distributorList.forEach((distributor) => {
      if (distributor.isUncheckable) {
        distributor.isSent = false;
      }
    });
    this.order_all = false;
    this.should_order_all = false;
  }

  distributorCheckedUnchecked(distributor) {
    this.inventory.distributorList.forEach((dis) => {
      if (dis.id === distributor.id) {
        dis.isSent = !dis.isSent;
      }
    });

    const distributorUncheckedList = this.inventory.distributorList.filter(
      (dist) => dist.isSent === false
    );
    this.order_all = distributorUncheckedList.length === 0;
  }

  async preprocessOrder() {
    if (this.inventory.order) return;
    let all_distributor_id_list = this.inventory.distributorList.map(
      (distributor) => distributor.distributor.id
    );
    let ordered_product_list = [];
    this.inventory.product_category_list.forEach((product_category) => {
      product_category.product_list.forEach((product) => {
        let { amount_to_order, product_id } = product;
        ordered_product_list.push({
          amount_to_order,
          product_id,
        });
      });
    });
    let data = {
      note: "Some note",
      restaurant_id: this.org.restaurant_id,
      side: this.restaurantSide,
      inventory_id: this.inventory_id,
      all_distributor_id_list,
      ordered_product_list,
    };
    let res = await this.callApi(apis.API_RESTAURANT_ADD_ORDER, data, { shouldBlockUi: true });
    if (!res.success) return null;
    let dm = {};
    this.inventory.distributorList.forEach((distributor) => {
      dm[distributor.distributor.id] = distributor.isSent;
    });
    await this._preparePage();
    this.inventory.distributorList.forEach((distributor) => {
      distributor.isSent = dm[distributor.distributor.id];
    });
  }

  async preprocessFinalizeOrder(status) {
    let send_to_distributor_id_list = [];
    this.inventory.distributorList.forEach((distributor) => {
      if (distributor.isSent && distributor.isUncheckable) {
        send_to_distributor_id_list.push(distributor.distributor.id);
      }
    });
    if (
      send_to_distributor_id_list.length === 0 &&
      this.inventory.order.sent_to_distributor_id_list.length === 0
    ) {
      await this.showAwaitableAlert(
        "Alert!",
        "Please select at least one rep to send your order out to."
      );
      return false;
    }
    let data = {
      order_id: this.inventory.order.id,
      status,
      send_to_distributor_id_list,
    };
    let res = await this.callApi(apis.API_RESTAURANT_SAVE_OR_FINALIZE_ORDER, data, {
      shouldBlockUi: true,
    });
    if (!res.success) return false;

    await this.showAwaitableAlert("Success!", "Your order has been finalized.");

    return true;
  }

  async saveOrderTapped() {
    if (this.isInEditMode) {
      await this.saveInventoryTapped();
      let createdFromPage = this.inventory.created_from_page;
      let message = "";
      if (createdFromPage === "inventory" && this.orderType != "orderCreate") {
        message = "Your inventory has been saved.";
      } else if (
        (createdFromPage == "inventory" && this.orderType == "orderCreate") ||
        createdFromPage === "order"
      ) {
        message = "Your order has been saved.";
      }
      await this.showAwaitableAlert("Success!", message);
    }
  }

  async submitOrderTapped() {
    if (this.isInEditMode) {
      await this.saveInventoryTapped();
    }

    let createdFromPage = this.inventory.created_from_page;
    // Make an inventory to an oder when "Create Order" button is pressed
    if (createdFromPage === "inventory" && this.orderType != "orderCreate") {
      let res = await this.callApi(
        apis.API_RESTAURANT_MAKE_INVENTORY_AN_ORDER,
        { inventory_id: this.inventory_id },
        { shouldBlockUi: true }
      );
      if (!res.success) return false;
      // await this.prepareInventoryAndOrderSummary();
      this.title = "Finalize Order";
      this.submitButtonText = "SUBMIT ORDER";
      this.addProductBtnText = "Add Products";
    } else {
      let isOrderContainsUnknownDistributor = this.inventory.distributorList.some((d) => {
        return d.isSent && d.distributor.name.toLowerCase().indexOf(" unknown") > -1;
      });
      if (isOrderContainsUnknownDistributor) {
        await this._showUnknownDistributorAlert();
      } else {
        await this._processSubmittedOrder();
      }
    }
  }

  async _showUnknownDistributorAlert() {
    let alertCtl = await this.alertCtrl.create({
      header: "Warning!",
      message:
        "Some items will not be ordered because there is no contact info for the rep. Do you wish to proceed?",
      buttons: [
        {
          text: "Cancel",
          handler: () => {},
        },
        {
          text: "Proceed",
          handler: async () => {
            await this._processSubmittedOrder();
          },
        },
      ],
    });
    await alertCtl.present();
  }

  async _processSubmittedOrder() {
    await this.preprocessOrder();
    let result = await this.preprocessFinalizeOrder("finalized");
    if (!result) return;
    await this.setRoot(routeConstants.KEXY.RESTAURANT_TABS);
  }

  shouldShowContactDialog: boolean = false;
  selectedContact: any;
  async contactTapped(distributor) {
    this.selectedContact = distributor;
    this.shouldShowContactDialog = true;
  }

  async closeContactDialog() {
    this.shouldShowContactDialog = false;
  }

  public loadingDialog: any = null;
  async startConversation(event, contact) {
    event.preventDefault();
    console.log({ contact });
    this.nodeSocket.emit("begin-conversation", {
      participant_id_list: [contact.distributor_employee.user_id],
    });
    this.loadingDialog = await this.loadingCtrl.create({
      spinner: "crescent",
      message: "Talking to the server. Please wait.",
    });
    this.loadingDialog.present();
  }

  async addProductToInventoryTapped() {
    let createdFromPage = this.inventory.created_from_page;
    await this.navigateTo(
      routeConstants.KEXY.RESTAURANT_TABS + "/" + routeConstants.KEXY.PLACE_ORDER,
      {
        inventory_id: this.inventory.id,
        from_finalize_order: true,
        pageType: createdFromPage,
      }
    );
  }

  editInventoryTapped() {
    this.isInEditMode = true;
  }

  async saveInventoryTapped() {
    let product_list = [];
    this.inventory.distributorList.forEach((d) => {
      d.product_category_list.forEach((pc) => {
        pc.product_list.forEach((p) => {
          let { amount_to_order, product_id } = p;
          product_list.push({
            amount_to_order,
            product_id,
          });
        });
      });
    });

    let res = await this.callApi(
      apis.API_RESTAURANT_INVENTORY_ORDER_PRODUCTS,
      {
        inventory_id: this.inventory.id,
        product_list,
      },
      { shouldBlockUi: true }
    );
    if (!res.success) return;

    this.isInEditMode = false;
  }

  cancelInventoryTapped() {
    this.isInEditMode = false;
  }

  backBtnPressed() {
    this.navCtrl.back({ animated: true, animationDirection: "back" });
  }
}
