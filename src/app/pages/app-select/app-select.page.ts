import { Component, OnInit } from "@angular/core";
import { constants } from "../../../common/shared";
import { Router } from "@angular/router";

@Component({
  selector: "app-app-select",
  templateUrl: "./app-select.page.html",
  styleUrls: ["./app-select.page.scss"],
})
export class AppSelectPage implements OnInit {
  public initialHref;

  constructor(private router: Router) {}

  ngOnInit() {}
  async selectApp(app: string) {
    window.localStorage.setItem(constants.USER_APP_TYEP, app);
    // Reload the app to show the correct statusbar color based on cannabis or restaurant
    // window.location = this.initialHref;
    console.log({ app });
    await this.router.navigate(["/kexy-login"]);
    // window.location.reload();
    // await this.navCtrl.setRoot(HomePage);
  }
}
