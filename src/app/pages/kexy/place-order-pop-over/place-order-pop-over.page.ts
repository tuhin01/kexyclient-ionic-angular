import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-place-order-pop-over",
  templateUrl: "./place-order-pop-over.page.html",
  styleUrls: ["./place-order-pop-over.page.scss"],
})
export class PlaceOrderPopOverPage implements OnInit {
  constructor(private viewCtrl: ModalController) {}

  ngOnInit() {}

  async itemClicked(data: string) {
    await this.viewCtrl.dismiss(data);
  }
}
