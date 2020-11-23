import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Settings } from "../../../model/Settings";
import { BasePage } from "../../basePage";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import {
  AlertController,
  LoadingController,
  MenuController,
  NavController,
  Platform,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { apis, constants } from "../../../../common/shared";

@Component({
  selector: "app-add-new-product",
  templateUrl: "./add-new-product.page.html",
  styleUrls: ["./add-new-product.page.scss"],
})
export class AddNewProductPage extends BasePage implements OnInit {
  public params: any;
  public restaurantSide: string = "foh";
  public allowedSide = "";
  public loading;
  public hideDistributorSearchResult: boolean = true;
  public categoryList = [];
  public distributorList: any[];
  public searchDistributorList: any[];
  public settings: Settings = null;
  public org: any = null;
  public user: any = null;
  public product: any = null;
  public selectedCategory: any = null;
  public inventoryId: any = null;
  public createdFromPage: any = null;
  public ignoreNextFilter = false;
  public primaryForm: FormGroup;
  public hideRepSearchResult: boolean = true;
  public searchRepList: any = [];
  public tabChange: boolean = false;
  public isEdit: boolean = false;
  public title = "Add New Product";
  public shouldShowEmailPhoneFiled: boolean = true;
  private fakeDistributor: any;

  _resetVariables() {
    this.categoryList = [];

    this.org = null;
    this.user = null;
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public formBuilder: FormBuilder,
    public menu: MenuController,
    public platform: Platform,
    public navCtrl: NavController
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
    if (this.router.getCurrentNavigation().extras.state) {
      this.params = this.router.getCurrentNavigation().extras.state;
    }
  }

  ngOnInit() {
    this.__addBlankProduct();

    this.primaryForm = new FormGroup({
      product_name: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(64),
          Validators.pattern("^[a-zA-Z-0-9 ]+$"),
        ])
      ),
      par_level: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(64),
          Validators.pattern("^[0-9 ]+$"),
        ])
      ),
      unit: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(128),
          Validators.pattern("^[a-zA-Z-0-9 ]+$"),
        ])
      ),
      distributor_name: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(64),
          Validators.pattern("^[a-zA-Z-0-9 ]+$"),
        ])
      ),
      rep_name: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(64),
          Validators.pattern("^[a-zA-Z-0-9 ]+$"),
        ])
      ),
      rep_email: new FormControl("", Validators.compose([Validators.required, Validators.email])),
      rep_phone: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(21),
          Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
        ])
      ),
    });

    this._preparePage();
  }

  async _preparePage() {
    this._resetVariables();
    this.org = await this.storage.get(constants.STORAGE_ORGANIZATION);
    this.user = await this.storage.get(constants.STORAGE_USER);

    console.log(this.org, this.user);
    this.allowedSide = this.org.side.toLowerCase();
    if (!this.tabChange) {
      this.selectedCategory = this.params.category;
      this.restaurantSide = this.params.side;
      this.inventoryId = this.params.inventory_id;
      this.createdFromPage = this.params.createdFromPage;
      this.tabChange = true;
      this.isEdit = this.params.is_edit;
    }

    await Promise.all([
      this.prepareCategoryList(),
      this.getDistrubutorList(this.restaurantSide),
      this._verifySubscription(),
    ]);

    if (this.isEdit) {
      this.title = "Edit Product";
      this.allowedSide = this.restaurantSide;
      this._prepareEditProduct();
    }
  }

  _prepareEditProduct() {
    this.product = this.params.product;
    this.product.employee.name = `${this.product.employee.first_name} ${this.product.employee.last_name}`;
    this.product.par_level = this.product.tempData.par_level;

    const distributor = this.distributorList.find(
      (dist) => dist.id === this.product.distributor_id
    );
    if (distributor) {
      this.selectDistributor(distributor);

      /** We need to ignore next filter of distributor or rep search here
       * since it's pre populated in product edit
       */
      this.ignoreNextFilter = false;

      this.searchRep();
      const rep = this.searchRepList.find(
        (rep) => rep.employee_id === this.product.distributor_employee_id
      );
      this.selectRep(rep);
    } else {
      this.product.distributor.name = "";
      this.product.employee.name = "";
    }
  }

  // ==================================================================

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

    let categoryList = res.data.product_category_list;
    categoryList = categoryList.filter(
      (category) => category.side.toLowerCase() === this.restaurantSide.toLowerCase()
    );
    this.categoryList = categoryList;
    console.log("categoryList", this.categoryList);
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
    console.log("NNN6", this.selectedCategory);
    // if (this.categoryList.length > 0) {
    //     await this.categoryTapped(this.selectedCategory);
    // }
  }

  __addBlankProduct() {
    this.product = {
      id: null,
      name: "",
      last_par_level: 0,
      par_level: "",
      unit: "",
      employee: {
        id: null,
        name: "",
        email: "",
        phone: "",
        is_claimed: false,
      },
      distributor: {
        id: 0,
        name: "",
        is_claimed: false,
      },
      qty_in_house: 0,
      amount_to_order: 0,
      custom_metrics: [],
      custom: {},
    };
  }

  async getDistrubutorList(side) {
    const postData = {
      search_string: "",
      zip_code: this.org.zip_code,
      side: side,
      limit: 100,
      page: 1,
    };
    let res = await this.callApi(apis.API_GET_DISTRIBUTOR_LIST, postData, { shouldBlockUi: false });
    if (!res.success) {
      //this.loading.dismiss();
      return;
    }
    this.distributorList = res.data.distributor_list;
    this.distributorList = this.distributorList
      .map((e) => e.id)
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => this.distributorList[e])
      .map((e) => this.distributorList[e]);
  }

  async categoryTapped(category) {
    if (this.isEdit) {
      this.showAwaitableAlert(
        "Warning!",
        "You may not switch to a different category when editing this product."
      );
    } else {
      this.selectedCategory = category;
      console.log(this.selectedCategory);
    }
  }

  async _verifySubscription() {
    let res = await this.callApi(apis.API_USER_GET_USER_ORGANIZATIONS, {});
    if (!res.success) return;
    if (res.data.restaurant_list.length > 0) {
      let restaurant = res.data.restaurant_list[0];
      this.fakeDistributor = restaurant.fake_distributor;
    }
  }

  selectDistributor(distributor) {

    this.product.distributor.id = distributor.id;
    this.product.distributor.name = distributor.name;
    this.ignoreNextFilter = true;
    this.searchDistributorList = [];
    this.hideDistributorSearchResult = true;
  }

  leaveDistributorField() {
    setTimeout(() => {
      this.searchDistributorList = [];
      this.hideDistributorSearchResult = true;
    }, 10);
  }

  searchRep() {
    if (this.ignoreNextFilter) {
      this.ignoreNextFilter = false;
      return;
    }

    this.shouldShowEmailPhoneFiled = true;
    this.primaryForm.controls["rep_email"].setValue("");
    this.primaryForm.controls["rep_phone"].setValue("");

    this.product.employee.id = "";
    this.product.employee.email = "";
    this.product.employee.phone = "";

    let employees = this.distributorList;
    if (this.product.distributor.id) {
      employees = this.distributorList.filter((dist) => this.product.distributor.id == dist.id);
    }
    if (this.product.employee.name === "") {
      this.searchRepList = [];
      this.hideRepSearchResult = true;
    } else {
      this.searchRepList = employees.filter(
        (v) =>
          v["employee_name"].toLowerCase().indexOf(this.product.employee.name.toLowerCase()) > -1
      );
      this.hideRepSearchResult = false;
    }
  }

  leaveRepField() {
    setTimeout(() => {
      this.searchRepList = [];
      this.hideRepSearchResult = true;
    }, 10);
  }

  selectRep(rep) {
    this.shouldShowEmailPhoneFiled = false;

    this.primaryForm.controls["rep_email"].setValue(rep.employee_email);
    this.primaryForm.controls["rep_phone"].setValue(rep.employee_phone);

    this.product.employee.id = rep.employee_id;
    this.product.employee.name = rep.employee_name;
    this.product.employee.email = rep.employee_email;
    this.product.employee.phone = rep.employee_phone;
    this.ignoreNextFilter = true;
    this.searchRepList = [];
    this.hideRepSearchResult = true;
  }

  protected searchDistributor() {
    if (this.ignoreNextFilter) {
      this.ignoreNextFilter = false;
      return;
    }

    this.product.distributor.id = "";
    this.product.employee.id = "";
    this.product.employee.name = "";
    this.product.employee.email = "";
    this.product.employee.phone = "";

    this.searchDistributorList = this.distributorList.filter((distributor) => {
      const value = this.product.distributor.name.toLowerCase();
      return distributor.name.toLowerCase().startsWith(value);
    });
    this.hideDistributorSearchResult = !(
      this.searchDistributorList.length > 0 && this.product.distributor.name !== ""
    );
  }

  async primaryFormSubmitted(): Promise<any> {
    let form = this.primaryForm.value;

    if (!form.product_name) {
      await this.showAwaitableAlert("Error!", "Product Name is required");
      return;
    }

    if (!form.unit) {
      await this.showAwaitableAlert("Error!", "Unit/Size is required");
      return;
    }

    if (form.rep_phone) {
      form.rep_phone = form.rep_phone.replace(/\D/g, "");
    }
    console.log("NNN", form);
    console.log("NNN", this.product);

    let distributor_id = "";
    if (this.product.distributor.name) {
      distributor_id = this.product.distributor.id ? this.product.distributor.id : "";
    } else {
      distributor_id = this.fakeDistributor.id;
    }

    let distributor_employee_id = "";
    if (this.product.employee.name) {
      distributor_employee_id = this.product.employee.id ? this.product.employee.id : "";
    } else {
      distributor_employee_id = this.fakeDistributor.employee[0].id;
    }

    let newProduct = {
      qty_in_house: this.product.qty_in_house || 0,
      amount_to_order: this.product.amount_to_order || 0,
      par_level: this.product.par_level || 0,
      product_id: this.product.id,
      product: {
        product_category_id: this.selectedCategory.id,
        name: this.product.name,
        unit: this.product.unit,
        distributor_id: distributor_id,
        distributor: {
          name: this.product.distributor.name
            ? this.product.distributor.name
            : this.fakeDistributor.name,
          phone: "",
        },
        distributor_employee_id: distributor_employee_id,
        distributor_employee: {
          name: this.product.employee.name
            ? this.product.employee.name
            : this.fakeDistributor.employee[0].user.first_name,
          email: this.product.employee.email
            ? this.product.employee.email
            : this.fakeDistributor.employee[0].user.email,
          phone: this.product.employee.phone
            ? this.product.employee.phone
            : this.fakeDistributor.employee[0].user.phone,
        },
        custom_metrics: {},
      },
    };
    console.log(newProduct);
    let tab = this.restaurantSide.toUpperCase();
    let postData = {
      inventory_date: "",
      restaurant_id: this.org.restaurant_id,
      side: tab,
      product_list: [newProduct],
    };
    let res = await this.callApi(apis.API_RESTAURANT_ADD_INVENTORY_IN_BULK, postData);
    if (!res.success) return;

    let message = "New product has been created.";
    if (this.isEdit) {
      message = "Product has been updated.";
    }
    await this.showAwaitableAlert("Success!", message);
    this.goToPlaceOrderOrInventory();
    // this.__addBlankProduct();
    // this.primaryForm.reset();
    //await this.navCtrl.setRoot(HomePage);
  }

  // ionViewCanLeave() {
  //
  //     this.goToPlaceOrderOrInventory();
  // }

  goToPlaceOrderOrInventory() {
    console.log("NNN4", this.inventoryId);
    // TODO - Fix me
    // this.setRootWithAnimation("PlaceOrderPage", {
    //   inventory_id: this.inventoryId,
    //   from_finalize_order: true,
    //   pageType: this.createdFromPage,
    // });
  }

  async segmentChanged(event) {
    let allowedSide = this.org.side.toLowerCase();
    console.log(allowedSide);
    let wasWrong = false;
    let message = `
    You are not authorized to access ${this.restaurantSide.toLocaleUpperCase()} features. 
    Please contact your account admin to receive access.`;
    if (allowedSide === "foh" && this.restaurantSide === "boh") {
      (<any>document.querySelector("#segment1")).click(); // workaround for ionic not switching style
      await this.showAwaitableAlert("Sorry!", message);
      this.restaurantSide = "foh";
      wasWrong = true;
    }
    if (allowedSide === "boh" && this.restaurantSide === "foh") {
      (<any>document.querySelector("#segment2")).click(); // workaround for ionic not switching style
      await this.showAwaitableAlert("Sorry!", message);
      this.restaurantSide = "boh";
      wasWrong = true;
    }
    console.log({ a: this.restaurantSide });
    if (!wasWrong) {
      await this._preparePage();
    }
  }
}
