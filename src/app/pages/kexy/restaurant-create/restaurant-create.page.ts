import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import {Storage} from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { statesUS } from '../../../../assets/statesUS';
import { countries } from '../../../../assets/Countries';
import { statesCanada } from '../../../../assets/statesCanada';
@Component({
  selector: 'app-restaurant-create',
  templateUrl: './restaurant-create.page.html',
  styleUrls: ['./restaurant-create.page.scss'],
})
export class RestaurantCreatePage extends BasePage implements OnInit {
  private readonly params: any;
  public side: string = 'FOH';

constructor(
    private restaurantCreateForm: FormGroup,
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    
    public modalShow: boolean = true,
    user: any = null,
    public statesList: Array<States> = [],
    public countryList: Array<Country> = [],
    public placeSuggestionList = [],
    googlePlacesService: google.maps.places.PlacesService,
    private imageUrl = null,
    private restaurant_id: number = null,
    private job_title: string = "",
    private stateLabel: string = "State",
    private zipLabel: string = "Zip Code",
    private geolocationDetails: any = {
        street_address: "",
        city: "",
        country: "",
        state: "",
        zip_code: "",
) {
  super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  if (this.router.getCurrentNavigation().extras.state) {
    this.params = this.router.getCurrentNavigation().extras.state;
  }
}

  ngOnInit() {
    this._disableMenu();

    this.restaurantCreateForm = new FormGroup({
        // job_title: new FormControl('', Validators.compose([
        //   Validators.required,
        //   Validators.minLength(0),
        //   Validators.maxLength(128)
        // ])),
        name: new FormControl("", Validators.compose([Validators.required, Validators.minLength(0), Validators.maxLength(64)])),
        phone: new FormControl(
            "",
            Validators.compose([
                Validators.required,
                Validators.minLength(0),
                Validators.maxLength(21),
                Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
            ])
        ),
        street_address: new FormControl(
            "",
            Validators.compose([Validators.required, Validators.minLength(0), Validators.maxLength(64)])
        ),
        city: new FormControl("", Validators.compose([Validators.required, Validators.minLength(0), Validators.maxLength(21)])),
        country: new FormControl("", Validators.compose([Validators.required, Validators.minLength(0), Validators.maxLength(21)])),
        state: new FormControl("", Validators.compose([Validators.required, Validators.minLength(0), Validators.maxLength(21)])),
        zip_code: new FormControl(
            "",
            Validators.compose([
                Validators.required,
                Validators.minLength(0),
                Validators.maxLength(5),
                Validators.pattern(/^[0-9]{5}(?:-[0-9]{4})?$/),
            ])
        ),
    });
  }
  async _showLocationSuggestions() {
    let geolocation;
    try {
        geolocation = await this.geolocation.getCurrentPosition();
    } catch (ex) {
        console.error(ex);
        this.modalShow = false;
        this.showAwaitableAlert("Geolocation", "You must allow geolocation in the settings of the App.");
        return;
    }

    console.log({ geolocation });

    let { latitude, longitude } = geolocation.coords;

    let location = new google.maps.LatLng(latitude, longitude);
    this.googlePlacesService = new google.maps.places.PlacesService(document.createElement("div"));

    this.placeSuggestionList = await new Promise((accept) => {
        this.googlePlacesService.nearbySearch(
            {
                location,
                // radius: 500,
                rankBy: google.maps.places.RankBy.DISTANCE,
                type: "restaurant",
            },
            (results, status) => {
                if (<any>status !== "OK") {
                    this.showAwaitableAlert("Sorry!", "We are having problem listing your nearby restaurants.");
                    this.modalShow = false;
                    return;
                }
                results = Array.from(results.slice(0, 6));

                console.log({ results });

                let placeSuggestionList = [];
                results.forEach((res) => {
                    let city = res.vicinity.split(",").reverse()[0];
                    placeSuggestionList.push({
                        name: res.name,
                        address: res.vicinity,
                        city,
                        place_id: res.place_id,
                    });
                });
                accept(placeSuggestionList);
            }
        );
    });

    if (this.placeSuggestionList.length < 1) {
        this.modalShow = false;
    }
    console.log("this.placeSuggestionList", this.placeSuggestionList);
}

modalCloseTapped() {
    this.modalShow = false;
}

addressClicked(placeSuggestion) {
    let { name, address, city, place_id } = placeSuggestion;
    this.restaurantCreateForm.controls["name"].setValue(name);
    this.restaurantCreateForm.controls["street_address"].setValue(address);
    this.restaurantCreateForm.controls["city"].setValue(city);
    this.placeSuggestionList = [];
    this.modalShow = false;
    this.googlePlacesService.getDetails(
        {
            placeId: place_id,
            fields: ["formatted_phone_number"],
        },
        (results, status) => {
            if (<any>status !== "OK") {
                this.showAwaitableAlert("Sorry!", "We are having problem fetching further data of that restaurant.");
                return;
            }
            if (results.formatted_phone_number) {
                this.restaurantCreateForm.controls["phone"].setValue(results.formatted_phone_number);
            }
        }
    );
}

async ionViewDidLoad() {
    console.log("ionViewDidLoad CannabisRestaurantCreatePage");
    this.user = await this.storage.get(constants.STORAGE_USER);
    this.job_title = await this.storage.get(constants.JOB_TITLE);
    console.log(this.job_title);
    await this.getCountryList();
    this._showLocationSuggestions();
}

public signupBtnTapped(): void {
    console.log(this.restaurantCreateForm);
    //this.restaurantCreateFormSubmitted();
}

async restaurantCreateFormSubmitted(): Promise<void> {
    if (!this.restaurantCreateForm.valid) {
        return;
    }

    let side = this.navParams.get("side");
    const distributor_id_list = this.navParams.get("distributorIdList");

    if (!side) {
        throw new Error("DEV_ERROR: Expected 'side' navParam.");
    }

    let data = {
        side,
        restaurant_id: this.restaurant_id,
        logo_image: this.imageUrl,
        job_title: this.job_title,
    };
    console.log(this.geolocationDetails.state);
    if (this.geolocationDetails.state == "") {
        this.showAwaitableAlert("Error", "Please select your state");
        return;
    }
    Object.assign(data, this.restaurantCreateForm.value);
    let restaurant_create_res;
    let restaurant_id;
    console.log(this.restaurant_id, data);
    if (this.restaurant_id === null) {
        restaurant_create_res = await this.callApi(apis.API_RESTAURANT_CREATE, data);
        restaurant_id = restaurant_create_res.data.restaurant_id;
    } else {
        restaurant_create_res = await this.callApi(apis.API_RESTAURANT_EDIT, data);
        restaurant_id = this.restaurant_id;
    }
    if (!restaurant_create_res.success) {
        return;
    }

    let zip_code = (<any>data).zip_code;

    // Required for JOIN flow
    if (distributor_id_list && distributor_id_list.length) {
        let distributorSelectionData = { distributor_id_list, restaurant_id };
        let distributor_select_res = await this.callApi(apis.API_RESTAURANT_SELECT_DISTRIBUTORS, distributorSelectionData);
        console.log(distributor_select_res);
    }

    this.restaurant_id = restaurant_id;

    // Add default locations, categories to the restaurant
    this.callApi(apis.API_RESTAURANT_COPY_DEFAULT_LOCATION_CATEGORY, { restaurant_id: restaurant_id }, { shouldBlockUi: false });

    await this.storage.remove(constants.IS_INVITED);
    await this.storage.remove(constants.IS_JOIN_TYPE);

    // this.navCtrl.push("CannabisRestaurantSetupDistributorRepPage", {
    //   restaurant_id, zip_code, side
    // });

    this.navCtrl.push("InviteRestaurantEmployeePage", {
        restaurant_id: this.restaurant_id,
    });
}

getDate(date) {
    return date.toJSON().slice(0, 19).replace("T", " ");
}

async presentFileChooser() {
    let imageData = await this.takePhoto.presentFileChooser();
    if (imageData) {
        this.imageUrl = imageData;
    }
}

public termsClicked(): void {
    this.navCtrl.push(TermsAndConditionsPage);
}

onCountrySelect() {
    let country = this.geolocationDetails.country;
    switch (country) {
        case "US":
            this.statesList = statesUS;
            this.stateLabel = "State";
            this.zipLabel = "Zip Code";
            this.restaurantCreateForm.setControl(
                "zip_code",
                this.fb.control("", [
                    Validators.required,
                    Validators.minLength(0),
                    Validators.maxLength(5),
                    Validators.pattern(/^[0-9]{5}(?:-[0-9]{4})?$/),
                ])
            );
            break;
        case "CA":
            this.statesList = statesCanada;
            this.stateLabel = "Province";
            this.zipLabel = "Postal Code";
            this.restaurantCreateForm.setControl(
                "zip_code",
                this.fb.control("", [
                    Validators.required,
                    Validators.minLength(0),
                    Validators.pattern(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/),
                ])
            );
            break;
    }
}

private getCountryList() {
    return new Promise((resolve, reject) => {
        this.countryList = countries;
        resolve("Done");
    });
}
}
