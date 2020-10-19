import { NavController, NavParams, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { constants, ApiDef, apis } from './shared';
import { getConfig } from './config';
import {HomePage} from '../app/pages/home/home.page';


export class BasePage {

  public config: any;
  private baseUri;
  public baseUriForImages;
  public isShowing = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public menu: MenuController
  ) {
    this.config = getConfig();
    this.baseUri = this.config.baseUri;
    this.baseUriForImages = this.baseUri.replace('/v1', '');

  }

  /** This method will be used to ensure currently logged in user have access to visit current page. */
  public async accessControl() {
    // TODO
  }

  /** Show an alert message. */
  public async showAwaitableAlert(title, subTitle, message = '') {
    // return await new Promise((accept, reject) => {
    //   let alert = this.alertCtrl.create({
    //     title,
    //     subTitle,
    //     message,
    //     buttons: [{
    //       text: 'Ok',
    //       handler: () => {
    //         alert.dismiss().then(() => accept());
    //         return false;
    //       }
    //     }]
    //   });
    //   alert.present();
    // });
  }

  private async _callApi(apiDef, data) {
    let url = this.baseUri + apiDef.path;
    let headers;
    if (apiDef.requiresAuthentication) {
      let token = await this.storage.get(constants.STORAGE_TOKEN);
      // console.log(token);
      // TODO - If token is not found then , should redirect to login
      if (!token) {
        //throw new Error('DEV_ERROR: Token not found');
        await this.removeLocalUserData();
        // this.navCtrl.setRoot(HomePage);

      }
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }
    let results = await this.httpClient.post(url, data, { 'headers': headers }).toPromise();
    return results;
  }

  public async callApi(apiDef: ApiDef, data, opt: any = {}) {
    let {
      handleNetworkErrors = true,
      handleValidationErrors = true,
      handleOtherErrors = true,
      shouldBlockUi = true
    } = opt;

    // let loading = this.loadingCtrl.create({
    //   spinner: 'crescent',
    //   content: 'Talking to the server. Please wait.'
    // });
    // if (shouldBlockUi) {
    //   if (!this.isShowing) {
    //     loading.present();
    //     this.isShowing = true;
    //   }
    // }

    // EXPLAIN: call server and convert any system error into standard error format
    let results;
    try {
      results = await this._callApi(apiDef, data);
      console.log({ path: apiDef.path, data, results });
      if (results === null) {
        throw new Error("Null Response Received");
      }
    } catch (ex) {
      if (ex instanceof HttpErrorResponse) {
        results = {
          success: false,
          error: {
            code: 'ERR_NETWORK_ERROR',
            details: ex
          }
        };
      } else {
        results = {
          success: false,
          error: {
            code: 'ERR_UNKNOWN_ERROR',
            details: ex
          }
        };
      }
    }
    // if (shouldBlockUi) {
    //   loading.dismiss();
    //   this.isShowing = false;
    // }

    if ('__DEV_ONLY__' in results) {
      console.log(results.__DEV_ONLY__);
    }

    if (!results.success && (['ERR_NETWORK_ERROR', 'ERR_UNKNOWN_ERROR'].indexOf(results.error.code) > -1) && handleNetworkErrors) {
      // console.log(results);
      // EXPLAIN: handle network errors
      let subTitle = 'Please make sure you are connected to the internet and try again.';
      let title = 'Something went wrong';

      try {
        console.log("HTTP Error occurred. HttpErrorResponse object: \n", results.error.details);
        if (results.error.details.message.indexOf('during parsing') > -1) {
          title = "PHP Error";
          subTitle = String(results.error.details.error.error.message) + "<br><br> Further details in developer console.";
          console.log(results.error.details.error.text);
        }
      } catch (ex) {
        'pass';
      }

      try {
        let errorMessage = results.error.details.error.message;
        if (
          (errorMessage.indexOf('You are not authorized to access that location') > -1)
        ) {
          await this.removeLocalUserData();
          // this.navCtrl.setRoot(HomePage);
          return results;
        }
      } catch (ex) {
        'pass';
      }


      await this.showAwaitableAlert(title, subTitle);

    } else if (!results.success && (['VALIDATION_ERROR'].indexOf(results.error.code) > -1) && handleValidationErrors) {
      // EXPLAIN: handle validation errors

      if (results.error.details) {
        let subTitle = 'Please provide the following information';
        let message = '';

        // const betterNames = {
        //   profile_photo: "Profile Photo",
        //   logo_image: "Company Logo Image"
        // };
        Object.keys(results.error.details).forEach(key => {
          //let name = (key in betterNames) ? betterNames[key] : key;
          let name = results.error.details[key];
          message += `<p class="error-message">&times; ${name}</p>`;
        });

        await this.showAwaitableAlert('Missing information', subTitle, message);

      } else if (results.error.message) {
        await this.showAwaitableAlert('Sorry!', results.error.message);
      } else {
        let subTitle = 'Expected details about failed validation.';
        await this.showAwaitableAlert('DEV_ERROR', subTitle);
      }

    } else if (!results.success && handleOtherErrors) {
      console.log("handleOtherErrors");
      try {
        let errorMessage = results.error.message;
        console.log(errorMessage);
        if (
          (errorMessage.indexOf('Signature verification failed') > -1) ||
          (errorMessage.indexOf('Expired token') > -1)
        ) {
          await this.removeLocalUserData();
          // this.navCtrl.setRoot(HomePage);
          return results;
        }
      } catch (ex) {
        'pass';
      }

      // EXPLAIN: handle network errors
      let subTitle = 'We cannot serve that request at this time';
      if ('code' in results.error) subTitle = `We cannot serve that request at this time. Error code ${results.error.code}.`;
      if ('message' in results.error) subTitle = results.error.message;
      await this.showAwaitableAlert('Sorry!', subTitle);
    }

    return results;
  }

  async storeDataAfterLogin({ token, user }) {
    if (!token || !user) {
      throw new Error("DEV_ERROR: Expected both token and user");
    }
    await this.storage.set(constants.STORAGE_TOKEN, token);
    await this.storage.set(constants.STORAGE_USER, user);
  }

  async removeLocalUserData() {
    await this.storage.remove(constants.STORAGE_USER);
    await this.storage.remove(constants.STORAGE_TOKEN);
    await this.storage.remove(constants.STORAGE_ORGANIZATION);
    await this.storage.remove(constants.IS_INVITED);
    await this.storage.remove(constants.IS_JOIN_TYPE);
    await this.storage.remove(constants.JOIN_TO_ORG);
    await this.storage.remove(constants.USER_SETTINGS);
  }

  async setRootWithAnimation(Page: any, parameters = {}) {
    // this.navCtrl.setRoot(Page, parameters, { animate: true, direction: 'forward' });
  }

  protected _enableDistributorMenu() {
    this.menu.enable(false, 'supplierMenu');
    this.menu.enable(false, 'restaurantMenu');
    this.menu.enable(true, 'distributorMenu');
  }

  protected _enableRestaurantMenu() {
    this.menu.enable(false, 'distributorMenu');
    this.menu.enable(false, 'supplierMenu');
    this.menu.enable(true, 'restaurantMenu');
  }

  protected _enableSupplierMenu() {
    this.menu.enable(false, 'distributorMenu');
    this.menu.enable(false, 'restaurantMenu');
    this.menu.enable(true, 'supplierMenu');
  }

  protected _disableMenu() {
    this.menu.enable(false, 'distributorMenu');
    this.menu.enable(false, 'supplierMenu');
    this.menu.enable(false, 'restaurantMenu');
  }


}
