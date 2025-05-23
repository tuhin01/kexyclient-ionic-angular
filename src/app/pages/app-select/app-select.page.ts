import { Component, OnInit } from "@angular/core";
import { constants } from "../../../common/shared";
import { NavController } from "@ionic/angular";
import {routeConstants} from '../../../common/routeConstants';

@Component({
  selector: "app-app-select",
  templateUrl: "./app-select.page.html",
  styleUrls: ["./app-select.page.scss"],
})
export class AppSelectPage implements OnInit {
  public initialHref;

  constructor(public navCtrl: NavController) {}

  ngOnInit() {}
  async selectApp(app: string) {
    window.localStorage.setItem(constants.USER_APP_TYEP, app);
    // Reload the app to show the correct statusbar color based on cannabis or restaurant

    console.log({ app });
    setTimeout( async () => {
      
      await this.navCtrl.navigateForward( routeConstants.HOME, { animated: false, replaceUrl: true });
      window.location.reload();
    }, 300);
    
  }
}
