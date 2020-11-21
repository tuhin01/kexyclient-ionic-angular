import { Component, Input, ViewChild } from "@angular/core";

@Component({
  selector: "accordion",
  templateUrl: "accordion.html",
})
export class AccordionComponent {
  accordionExapanded = false;
  @ViewChild("cc") cardContent: any;
  @Input("title") title: string;

  icon: string = "chevron-down-outline";

  constructor() {}

  toggleAccordion() {
    this.accordionExapanded = !this.accordionExapanded;
    this.icon = this.icon == "chevron-down-outline" ? "chevron-up-outline" : "chevron-down-outline";
  }
}
