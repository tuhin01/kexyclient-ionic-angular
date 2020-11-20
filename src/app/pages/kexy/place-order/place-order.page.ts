import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import {
  AlertController,
  LoadingController,
  MenuController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { Settings } from "../../../model/Settings";
import { apis, constants } from "../../../../common/shared";
import { CameraService } from "../../../services/camera.service";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { routeConstants } from "../../../../common/routeConstants";
import { PlaceOrderPopOverPage } from "../place-order-pop-over/place-order-pop-over.page";

@Component({
  selector: "app-place-order",
  templateUrl: "./place-order.page.html",
  styleUrls: ["./place-order.page.scss"],
})
export class PlaceOrderPage extends BasePage implements OnInit {
  protected params: any;
  public restaurantSide: string = "foh";
  public isOrderPage: boolean = true;
  public allowedSide = "";
  public loading;

  public categoryList = [];
  public locationList = [];
  public selectedProductList = [];
  public productList = [];
  public productListCache: any = [];

  public sort: boolean = false;
  public showAllProduct: boolean = true;
  public is_from_finalize_order: boolean = false;

  public singleViewProductIndex = 0;
  public singleViewProduct = null;

  public settings: Settings = null;
  public org: any = null;
  public user: any = null;
  public inventory_date = null;
  public selectedLocation: any = null;
  public selectedCategory: any = null;

  public search_string = "";
  public pageType: string = "order";

  public noteTaking: any = {};
  public calculatorProduct: any;
  public calculatorPropertyName: any;
  public calculatorPropertyValue: any;
  public calculatorUnit: string;
  public calculatorTop: any;
  public inventory_id: any = "";
  public possible_order_number: any;
  public inventory_employee: any;
  public calculatorArrowLeft: any;
  public calculatorLeft: number;
  public shouldShowSubscriptionDialog: boolean = false;
  public doesNotHaveProperSubscription: boolean = false;
  public isSubscriptionTrial: boolean = false;
  public preventPageLeave: boolean;
  public showCategoryModal: any = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    private cameraService: CameraService,
    private keyboard: Keyboard,
    public popoverController: PopoverController
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    /********/
    // We must do everything in ionViewDidEnter()
    // Since ngOnInit() is called only once as this page is a child of a tab
    /********/
  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.params = params;
      }
    });

    (async () => {
      await this._preparePage();
    })();
  }

  __prepName(name) {
    return name.split("")[0] + ".";
  }

  _resetNote() {
    this.noteTaking = {
      show: false,
      type: "overall", // overall, product
      product: null,
      text: "",
    };
  }

  _resetVariables() {
    this.categoryList = [];
    this.locationList = [];
    this.selectedProductList = [];
    this.productList = [];
    this.productListCache = [];

    this.sort = false;
    this.showAllProduct = true;

    this.singleViewProductIndex = 0;
    this.singleViewProduct = null;

    this.org = null;
    this.user = null;
    this.inventory_date = null;
    this.selectedLocation = null;
    this.selectedCategory = null;

    this.calculatorProduct = undefined;
    this.calculatorPropertyName = undefined;
    this.calculatorPropertyValue = undefined;
    this.calculatorUnit = undefined;
    this.calculatorTop = undefined;
    this.inventory_id = "";
    this.inventory_employee = undefined;

    this.possible_order_number = "PENDING";

    this.search_string = "";
    this._resetNote();
  }

  createProductNote(product) {
    if (!product.selectedProduct) {
      this.productQuantityChanged(product);
    }
    this._resetNote();
    this.noteTaking = {
      show: true,
      type: "product",
      product: product,
      text: product.selectedProduct.note,
    };
  }

  cancelNote() {
    this._resetNote();
  }

  saveNote() {
    this.noteTaking.product.selectedProduct.note = this.noteTaking.text;
    this._resetNote();
  }

  ionViewDidLeave() {
    console.log("ionViewDidLeave called");
    this.params = undefined;
    this.isOrderPage = true;
    this.pageType = "order";
    console.log(this.params);
    console.log(this.isOrderPage);
    console.log(this.pageType);
  }

  ngOnDestroy() {
    console.log("ngOnDestroy called");
    this.params = undefined;
    this.isOrderPage = true;
    this.pageType = "order";
    console.log(this.params);
    console.log(this.isOrderPage);
    console.log(this.pageType);
  }

  async _preparePage() {
    this._resetVariables();

    console.log(this.params);
    console.log(this.isOrderPage);
    console.log(this.pageType);

    let inventory_id;
    if (this.params && this.params.pageType) {
      this.pageType = this.params.pageType;
    }

    if (this.params && this.params.inventory_id) {
      inventory_id = this.params.inventory_id;
    }
    this.isOrderPage = this.pageType === "order";
    console.log("isOrderPage", this.isOrderPage);

    this.settings = await this.storage.get(constants.USER_SETTINGS);
    this.org = await this.storage.get(constants.STORAGE_ORGANIZATION);
    this.user = await this.storage.get(constants.STORAGE_USER);
    this._verifySubscription().then((r) => false);

    this.inventory_employee = this.user;
    this.inventory_date = new Date();
    this.allowedSide = this.org.side.toLowerCase();
    if (inventory_id && inventory_id !== "NOT_SET") {
      this.inventory_id = parseInt(String(inventory_id));
      await this.loadExistingInventory();
    }
    if (this.params && this.params.from_finalize_order) {
      this.is_from_finalize_order = true;
    }

    await Promise.all([this.prepareLocationList(), this.prepareCategoryList()]);
  }

  async loadExistingInventory() {
    let res = await this.callApi(
      apis.API_RESTAURANT_GET_INVENTORY_TO_EDIT,
      {
        restaurant_id: this.org.restaurant_id,
        inventory_id: this.inventory_id,
      },
      { shouldBlockUi: true }
    );
    if (!res.success) {
      //this.loading.dismiss();
      return;
    }
    let inventory = res.data.inventory;
    this.selectedProductList = inventory.product_list;
    this.possible_order_number = inventory.possible_order_number;
    this.inventory_date = new Date(inventory.inventory_date).toLocaleDateString();
    this.inventory_employee = inventory.employee;
  }

  closeKeyboard(event: KeyboardEvent) {
    if (event.code === "Enter") {
      this.keyboard.hide();
    }
  }

  // ==================================================================

  async prepareLocationList() {
    let res = await this.callApi(
      apis.API_RESTAURANT_GET_LOCATION_IN_RESTAURANT_LIST,
      {
        restaurant_id: this.org.restaurant_id,
        side: this.restaurantSide.toUpperCase(),
      },
      { shouldBlockUi: true }
    );
    if (!res.success) {
      //this.loading.dismiss();
      return;
    }
    this.locationList = res.data.location_in_restaurant_list;
    if (this.locationList.length > 0) {
      await this.locationTapped(this.locationList[0]);
    }
  }

  async locationTapped(location) {
    this.selectedLocation = location;
    if (this.selectedCategory) {
      await this.categoryTapped(this.selectedCategory, false);
    }
  }

  async prepareCategoryList() {
    let res = await this.callApi(
      apis.API_RESTAURANT_GET_PRODUCT_CATEGORY_LIST,
      {
        restaurant_id: this.org.restaurant_id,
      },
      { shouldBlockUi: true }
    );
    if (!res.success) {
      //this.loading.dismiss();
      return;
    }
    this.singleViewProductIndex = 0;
    this.updateSingleViewProduct();
    let categoryList = res.data.product_category_list;
    categoryList = categoryList.filter(
      (category) => category.side.toLowerCase() === this.restaurantSide.toLowerCase()
    );
    this.categoryList = categoryList;
    this.categoryList.sort(function (a, b) {
      let catA = a.name.toLowerCase();
      let catB = b.name.toLowerCase();
      if (catA < catB) {
        return -1;
      }
      if (catA > catB) {
        return 1;
      }
      return 0;
    });
    if (this.categoryList.length > 0) {
      await this.categoryTapped(this.categoryList[0], false);
    }
  }

  async categoryTapped(category, shouldBlockUi = true) {
    this.search_string = "";
    this.selectedCategory = category;
    if (this.productListCache.length === 0) {
      let res = await this.callApi(
        apis.API_RESTAURANT_GET_PRODUCT_LIST,
        {
          restaurant_id: this.org.restaurant_id,
          side: this.restaurantSide.toUpperCase(),
        },
        { shouldBlockUi: shouldBlockUi }
      );
      //this.loading.dismiss();
      if (!res.success) return;
      this.productListCache = res.data.product_list;
    }
    let product_category_id = category.id;
    let productList = this.productListCache
      .filter((product) => product.product_category_id === product_category_id)
      .map((product) => JSON.parse(JSON.stringify(product)));

    this.mapTemporaryProductList(productList);
    this.productList = productList;
    this.updateSingleViewProduct();
  }

  // ==================================================================

  mapTemporaryProductList(productList) {
    productList.forEach((product) => {
      product.tempData = {};
      let selectedProduct;
      if (this.isOrderPage) {
        selectedProduct = this.selectedProductList.find(
          (selectedProduct) => selectedProduct.product_id === product.id
        );
      } else {
        selectedProduct = this.selectedProductList.find(
          (selectedProduct) =>
            selectedProduct.product_id === product.id &&
            selectedProduct.location_in_restaurant_id === this.selectedLocation.id
        );
      }

      if (selectedProduct) {
        product.selectedProduct = selectedProduct;
        let { total_qty_in_house, qty_in_house, amount_to_order, par_level } = selectedProduct;
        Object.assign(product.tempData, {
          total_qty_in_house,
          qty_in_house,
          amount_to_order,
          par_level,
        });
      }
      product.name = product.name.toLowerCase();
      if (!product.tempData.par_level) {
        product.tempData.par_level = Math.ceil(product.last_par_level);
      }
      this.calculateProductData(product);
    });
  }

  ensureSelectedProductIsInTemporaryProduct(product) {
    if (!product.selectedProduct) {
      product.selectedProduct = {
        product_id: product.id,
        location_in_restaurant_id: this.isOrderPage ? 0 : this.selectedLocation.id,
        // We have hide location in the app.
        // But It require lot's of changes to get rid of location completely from the system.
        // For now 0 will help ignoring any error
        product_category_id: product.product_category_id,
        qty_in_house: 0,
        amount_to_order: 0,
        note: "",
        par_level: product.last_par_level,
        total_qty_in_house: 0,
      };
      this.selectedProductList.push(product.selectedProduct);
    }
  }

  calculateProductData(product) {
    let isProductIsListedInSelectedProductList = false;
    let list = this.selectedProductList.filter((selectedProduct) => {
      if (selectedProduct.product_id === product.id) {
        isProductIsListedInSelectedProductList = true;
        return selectedProduct;
      }
    });
    let par_level = parseFloat(String(product.tempData.par_level));
    let total_qty_in_house = list.reduce(
      (sum, selectedProduct) => sum + selectedProduct.qty_in_house,
      0
    );
    let amount_to_order = Math.max(par_level - total_qty_in_house, 0);
    list.forEach((selectedProduct) => {
      // amount_to_order must only be picked from product.tempData if it's on order and not inventory
      // to show the amount_to_order value that user typed when changing category back & forth
      if (this.isOrderPage) {
        amount_to_order = parseFloat(String(product.tempData.amount_to_order));
      }
      Object.assign(selectedProduct, { total_qty_in_house, amount_to_order, par_level });
    });

    // product.tempData.total_qty_in_house
    // product.tempData.amount_to_order
    // These must NOT be deleted when user is taking inventory & isProductIsListedInSelectedProductList = false
    if (total_qty_in_house < 1 && !isProductIsListedInSelectedProductList) {
      try {
        delete product.tempData.total_qty_in_house;
        delete product.tempData.amount_to_order;
      } catch (e) {}
    } else {
      Object.assign(product.tempData, { total_qty_in_house, amount_to_order, par_level });
    }
  }

  productQuantityChanged(product) {
    this.ensureSelectedProductIsInTemporaryProduct(product);

    product.selectedProduct.qty_in_house = product.tempData.qty_in_house =
      parseFloat(product.tempData.qty_in_house) || "";

    this.calculateProductData(product);
  }

  productParLevelChanged(product) {
    this.productQuantityChanged(product);
  }

  productAmountToOrderChanged(product) {
    this.ensureSelectedProductIsInTemporaryProduct(product);

    let list = this.selectedProductList.filter(
      (selectedProduct) => selectedProduct.product_id === product.selectedProduct.product_id
    );

    let par_level = parseFloat(String(product.tempData.par_level));
    let total_qty_in_house = list.reduce(
      (sum, selectedProduct) => sum + selectedProduct.qty_in_house,
      0
    );
    let amount_to_order = parseFloat(String(product.tempData.amount_to_order));

    list.forEach((selectedProduct) => {
      Object.assign(selectedProduct, { total_qty_in_house, amount_to_order, par_level });
    });

    Object.assign(product.tempData, { total_qty_in_house, amount_to_order, par_level });
    let total_qty_will_be_in_house = amount_to_order + total_qty_in_house;
    // If par level update is on in user settings
    if (this.settings && this.settings.par_level_update) {
      if (total_qty_will_be_in_house > par_level && par_level > 0) {
        this.showParChangeAlert(total_qty_will_be_in_house, product);
      }
    }
    console.log("NNN5", product);
  }

  async showParChangeAlert(total_qty_will_be_in_house, product) {
    let product_id = product.id;
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
              { shouldBlockUi: false }
            );
            if (!res.success) {
              await this.showAwaitableAlert("Sorry!", "Something went wrong. Try again later");
            } else {
              product.tempData.par_level = total_qty_will_be_in_house;
              product.par_level = total_qty_will_be_in_house;

              this.selectedProductList.forEach((selectedProduct) => {
                if (product.par_level == 0) {
                  product.par_level = Math.ceil(
                    product.total_qty_in_house + product.amount_to_order
                  );
                }
                if (selectedProduct.product_id == product.id) {
                  selectedProduct.par_level = Math.ceil(total_qty_will_be_in_house);
                }
              });

              //await this.showAwaitableAlert("Success!", res.data.message);
            }
          },
        },
      ],
    });
    await confirm.present();
  }

  async searchStringChanged() {
    /* If no search text typed then select the first category */
    if (this.search_string.length === 0) {
      if (this.categoryList.length > 0) {
        await this.categoryTapped(this.categoryList[0], false);
      }
    } else {
      let productList = this.productListCache.filter((product) => {
        if (
          product.name.substr(0, this.search_string.length).toUpperCase() ==
          this.search_string.toUpperCase()
        ) {
          return product;
        }
      });
      this.mapTemporaryProductList(productList);
      this.productList = productList;
      this.showAllProduct = true;
    }
    // if (!products) return;
    // let category = this.categoryList.find(category => category.id === product.product_category_id);
    // console.log("NNN2", category);
    // if (!category) return;
    // // await this.categoryTapped(category);
    // this.singleViewProductIndex = this.productList.findIndex(_product => _product.id === product.id);
    // console.log(this.singleViewProductIndex);
    // this.updateSingleViewProduct();
  }

  // ==================================================================

  async processAddIntentory(type = "") {
    if (this.doesNotHaveProperSubscription === true) {
      this.shouldShowSubscriptionDialog = true;
      return null;
    }
    let createdFromPage = "inventory";
    if (this.isOrderPage) {
      createdFromPage = "order";
    }
    if (type && type === "orderCreate") createdFromPage = "order";

    this.selectedProductList.forEach((product) => {
      if (product.par_level == 0) {
        product.par_level = Math.ceil(product.total_qty_in_house + product.amount_to_order);
      }
    });
    let data = {
      note: "",
      inventory_id: this.inventory_id,
      inventory_date: this.inventory_date,
      restaurant_id: this.org.restaurant_id,
      created_by_restaurant_employee_id: this.user.id, // TODO: Remove
      side: this.restaurantSide,
      created_from_page: createdFromPage,
      product_list: this.selectedProductList,
    };

    let res = await this.callApi(apis.API_RESTAURANT_ADD_INVENTORY, data, {
      shouldBlockUi: true,
    });
    if (!res.success) return null;
    return res.data.inventory_id;
  }

  async confirmOrderCreation() {
    const confirm = await this.alertCtrl.create({
      header: "Creating Order?",
      message: "Are you sure you want to create an order?",
      buttons: [
        {
          text: "No",
          handler: () => {},
        },
        {
          text: "Yes",
          handler: async () => {
            await this.preFinalizeOrderTapped("orderCreate");
          },
        },
      ],
    });
    await confirm.present();
  }

  async preFinalizeOrderTapped(type, action = "") {
    let inventory_id;
    // console.log(this.selectedProductList.length);
    if (action === "addNewProduct" && this.selectedProductList.length < 1) {
      inventory_id = "NOT_SET";
    } else {
      inventory_id = await this.processAddIntentory(type);
    }
    if (inventory_id === null) return;
    this.preventPageLeave = false;
    if (action === "addNewProduct") {
      await this.navigateTo(routeConstants.KEXY.ADD_NEW_PRODUCT, {
        inventory_id,
        createdFromPage: this.isOrderPage ? "order" : "",
        category: this.selectedCategory,
        side: this.restaurantSide,
      });
    } else {
      // TODO - Fix me
      // await this.navCtrl.push("FinalizeOrderPage", {
      //   inventory_id,
      //   restaurantSide: this.restaurantSide,
      //   type,
      // });
    }
  }

  async addInventoryTapped() {
    let inventory_id = await this.processAddIntentory();
    if (inventory_id === null) return;
    this.inventory_id = inventory_id;
    await this.showAwaitableAlert("Success!", "Saved successfully.");
    this.preventPageLeave = false;
    if (this.is_from_finalize_order) {
      //this.navCtrl.push('CannabisFinalizeOrderPage', { inventory_id, restaurantSide: this.restaurantSide })
      await this.navCtrl.pop();
    }
    // this.navCtrl.setRoot(HomePage);
  }

  // ==================================================================

  previousProductTapped() {
    if (this.singleViewProductIndex === 0) {
      this.singleViewProductIndex = this.productList.length - 1;
    } else {
      this.singleViewProductIndex -= 1;
    }
    this.updateSingleViewProduct();
  }

  updateSingleViewProduct() {
    this.singleViewProduct = {
      tempData: {
        qty_in_house: "",
        par_level: "",
        amount_to_order: "",
        unit: "",
        total_qty_in_house: "",
      },
    };
    window.setTimeout(() => {
      if (this.productList.length > 0) {
        this.singleViewProduct = this.productList[this.singleViewProductIndex];
      }
    }, 0);
  }

  nextProductTapped() {
    if (this.singleViewProductIndex === this.productList.length - 1) {
      this.singleViewProductIndex = 0;
    } else {
      this.singleViewProductIndex += 1;
    }
    this.updateSingleViewProduct();
  }

  sortProducts() {
    this.sort = !this.sort;
    this.productList = this.productList.reverse();
    this.updateSingleViewProduct();
  }

  dateChanged() {}

  async trashTapped() {
    if (this.inventory_id) {
      let data = {
        inventory_id: this.inventory_id,
      };
      let res = await this.callApi(apis.API_RESTAURANT_DELETE_INVENTORY, data, {
        shouldBlockUi: true,
      });
      if (!res.success) return null;
      await this.showAwaitableAlert("Success!", "The inventory has been deleted.");
    }
    await this.setRoot(routeConstants.HOME);
  }

  presentCalculatorPopover(event, product, propertyName, i = 0, type = "") {
    event.preventDefault();
    event.stopPropagation();

    // document.querySelector('#scroll-marker').scrollIntoView();

    // if (propertyName === 'amount_to_order' && !this.isNumbery(product.tempData.qty_in_house)) return;
    if (propertyName === "par_level" && !this.isNumbery(product.tempData.qty_in_house)) return;

    this.calculatorProduct = product;
    this.calculatorPropertyName = propertyName;
    this.calculatorPropertyValue =
      parseFloat(String(this.calculatorProduct.tempData[this.calculatorPropertyName])) || 0;
    this.calculatorUnit = "Case(s)";
    if (product.unit === "Bottles") this.calculatorUnit = "Bottle(s)";

    if (type === "single") {
      if (!this.isOrderPage) {
        this.calculatorTop = 266 + 340 + 20 + i;
      } else {
        this.calculatorTop = 266 + 285 + 20 + i;
      }
    } else {
      this.calculatorTop = 266 + 340 + (i + 1) * 39;
    }

    this.calculatorArrowLeft = event.target.getBoundingClientRect().left;
    this.calculatorLeft = Math.max(this.calculatorArrowLeft - 400 / 2, 0);

    setTimeout(() => {
      document
        .querySelector(".tr-calculator")
        .scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }, 10);
  }

  calculatorBackdropClicked() {
    //this.close();
  }

  // buySuscription() {
  //     window.open("https://www.getkexy.com/product-listing/", "_system");
  // }

  async buySuscription() {
    // this._generalService
    //   .post("user/getPurchaseSSOToken", {})
    //   .subscribe((response) => {
    //     console.log(response);
    //     let { ssoToken } = response.data;
    //     let url = `https://www.getkexy.com/product-listing/?kexyauthtoken=${ssoToken}`;
    //     window.open(url, '_blank');
    //   });

    let response = await this.callApi(apis.API_USER_GET_SSO_TOKEN, {});
    let { ssoToken } = response.data;
    let url = `https://www.getkexy.com/product-listing/?kexyauthtoken=${ssoToken}`;
    window.open(url, "_system");
  }

  checkSubscription() {
    this._verifySubscription();
  }

  async closeSubscriptionDialog() {
    this.shouldShowSubscriptionDialog = false;
  }

  async _verifySubscription() {
    // TODO - Need cleanup. We are giving away our app for FREE and no longer need to check for Subscription
    this.doesNotHaveProperSubscription = false;
    this.shouldShowSubscriptionDialog = false;

    // let res = await this.callApi(apis.API_USER_GET_USER_ORGANIZATIONS, {});
    // if (!res.success) return;
    // if (res.data.restaurant_list.length > 0) {
    //     let restaurant = res.data.restaurant_list[0];
    //     //console.log( (new Date(restaurant.subscription.expire_date).getTime() < Date.now()))
    //     if (!restaurant.subscription || restaurant.subscription.status !== "active") {
    //         this.doesNotHaveProperSubscription = true;
    //         this.shouldShowSubscriptionDialog = true;
    //     } else if (new Date(restaurant.subscription.expire_date).getTime() < Date.now()) {
    //         this.doesNotHaveProperSubscription = true;
    //         this.shouldShowSubscriptionDialog = true;
    //         if (restaurant.subscription.payment_status === "trial") {
    //             this.isSubscriptionTrial = true;
    //         }
    //     }
    // }
  }

  async addProduct() {
    if (this.pageType === "inventory") {
      await this.preFinalizeOrderTapped("", "addNewProduct");
    } else {
      await this.preFinalizeOrderTapped("orderCreate", "addNewProduct");
    }
  }

  _publish() {
    this.preventPageLeave = true;
    this.calculatorProduct.tempData[this.calculatorPropertyName] = this.calculatorPropertyValue;
    if (this.calculatorPropertyName === "qty_in_house")
      this.productQuantityChanged(this.calculatorProduct);
    else if (this.calculatorPropertyName === "par_level")
      this.productParLevelChanged(this.calculatorProduct);
    else if (this.calculatorPropertyName === "amount_to_order")
      this.productAmountToOrderChanged(this.calculatorProduct);
  }

  close() {
    this.calculatorProduct = null;
  }

  saveAndClose() {
    this._publish();
    this.calculatorProduct = null;
  }

  add(amount) {
    this.calculatorPropertyValue =
      Math.round((parseFloat(String(this.calculatorPropertyValue)) + amount) * 100) / 100;
    // this._publish();
  }

  subtract(amount) {
    this.calculatorPropertyValue = Math.max(
      Math.round((parseFloat(String(this.calculatorPropertyValue)) - amount) * 100) / 100,
      0
    );

    // this._publish();
  }

  setDec(amount) {
    this.calculatorPropertyValue =
      Math.ceil(parseFloat(String(this.calculatorPropertyValue))) + amount;
    // this._publish();
  }

  digitTapped(digit) {
    let calculatorPropertyValue = String(this.calculatorPropertyValue);
    calculatorPropertyValue += digit;
    this.calculatorPropertyValue = parseFloat(calculatorPropertyValue) || 0;
  }

  pointTapped() {
    let calculatorPropertyValue = String(this.calculatorPropertyValue);
    if (calculatorPropertyValue.indexOf(".") > -1) {
      return;
    }
    this.calculatorPropertyValue += ".";
    //this.calculatorPropertyValue = calculatorPropertyValue || 0;
  }

  removeLast() {
    let calculatorPropertyValue = String(this.calculatorPropertyValue);
    if (calculatorPropertyValue.length === 0) return;
    calculatorPropertyValue = calculatorPropertyValue.slice(0, calculatorPropertyValue.length - 1);
    this.calculatorPropertyValue = parseFloat(calculatorPropertyValue) || 0;
    // this._publish();
  }

  clear() {
    this.calculatorPropertyValue = 0;
    // this._publish();
  }

  ionViewWillLeave() {
    console.log("ionViewWillLeave called");
    this.params = undefined;
    this.isOrderPage = true;
    this.pageType = "order";
    console.log(this.params);
    console.log(this.isOrderPage);
    console.log(this.pageType);

    if (!this.preventPageLeave) return false;
    (async () => {
      let alertPopup = await this.alertCtrl.create({
        header: "Discard Changes",
        message: "Any unsaved changes will be lost. Are you sure you want to proceed?",
        buttons: [
          {
            text: "Exit",
            handler: () => {
              this.exitPage();
            },
          },
          {
            text: "Stay",
            handler: () => {
              // need to do something if the user stays?
            },
          },
        ],
      });
      await alertPopup.present();
    })();
  }

  async segmentChanged(event) {
    let allowedSide = this.org.side.toLowerCase();
    let wasWrong = false;
    if (allowedSide === "foh" && this.restaurantSide === "boh") {
      (<any>document.querySelector("#segment1")).click(); // workaround for ionic not switching style
      this.showAwaitableAlert(
        "Sorry!",
        "You are not authorized to access BOH features. Please contact your account admin to receive access."
      );
      this.restaurantSide = "foh";
      wasWrong = true;
    }
    if (allowedSide === "boh" && this.restaurantSide === "foh") {
      (<any>document.querySelector("#segment2")).click(); // workaround for ionic not switching style
      this.showAwaitableAlert(
        "Sorry!",
        "You are not authorized to access FOH features. Please contact your account admin to receive access."
      );
      this.restaurantSide = "boh";
      wasWrong = true;
    }
    if (!wasWrong) {
      this._preparePage();
    }
  }

  // ==================================================================

  isNumbery(c) {
    let parsed = parseFloat(c);
    return !isNaN(parsed);
  }

  async exitPage() {
    this.preventPageLeave = false;
    await this.navCtrl.pop();
  }

  async extendTrialRequest() {
    let res = await this.callApi(apis.API_TRIAL_EXTEND_REQUEST, {
      restaurant_id: this.org.restaurant_id,
    });
    if (!res.success) return;
    await this.showAwaitableAlert("Success!", "Your trial extend request has been sent.");
  }

  async editProduct(product: any) {
    let inventory_id = "NOT_SET";
    await this.navigateTo(routeConstants.KEXY.ADD_NEW_PRODUCT, {
      inventory_id,
      createdFromPage: this.isOrderPage ? "order" : "",
      category: this.selectedCategory,
      side: this.restaurantSide,
      is_edit: true,
      product: product,
    });
  }

  isProductEdit: boolean = false;

  async presentPopover(event) {
    const popover = await this.popoverController.create({
      component: PlaceOrderPopOverPage,
      event,
      translucent: true,
      mode: "ios",
      cssClass: "tr-popover",
      componentProps: {
        isOrderPage: this.isOrderPage,
      },
    });

    popover.onWillDismiss().then(async (data) => {
      console.log({data});
      switch (data) {
        case "addCategory":
          this.showCategoryModal = true;
          break;
        case "addProduct":
          await this.addProduct();
          break;
        case "editProduct":
          this.isProductEdit = true;
          break;
        case "cancel":
          this.isProductEdit = false;
          break;
        default:
          break;
      }
    });

    return await popover.present();
  }

  categoryName: string = "";
  categoryImageUrl: any = null;
  newImageUploaded: boolean = false;

  async saveCategory() {
    let postData = {
      restaurant_id: this.org.restaurant_id,
      side: this.restaurantSide,
      name: this.categoryName,
      category_photo: this.categoryImageUrl,
    };
    if (this.newImageUploaded) {
      postData.category_photo = this.categoryImageUrl;
    }
    if (this.categoryName === "") {
      await this.showAwaitableAlert("Error!", "Please type a category name");
      return;
    }
    let res = await this.callApi(apis.API_RESTAURANT_ADD_CATEGORY, postData);
    if (!res.success) return;

    let newCategory = {
      id: res.data.category_id,
      restaurant_id: this.org.restaurant_id,
      side: this.restaurantSide,
      name: this.categoryName,
      photo: res.data.photo_url,
    };
    this.categoryList.unshift(newCategory);
    await this.categoryTapped(newCategory);

    await this.showAwaitableAlert("Success!", "New category has been created.");
    this.showCategoryModal = false;
    this.categoryName = "";
    this.categoryImageUrl = null;
    this.newImageUploaded = false;
  }

  closeAddCategoryModal() {
    this.showCategoryModal = false;
  }

  async presentFileChooser() {
    let imageData = await this.cameraService.presentFileChooser();
    if (imageData) {
      this.categoryImageUrl = imageData;
      this.newImageUploaded = true;
    }
  }

  async backButtonPress() {
    if (this.isProductEdit) {
      this.isProductEdit = false;
    } else {
      await this.setRootWithAnimationBackword(routeConstants.KEXY.RESTAURANT_TABS);
    }
  }
}
