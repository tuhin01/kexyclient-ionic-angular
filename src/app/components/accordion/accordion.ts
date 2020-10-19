import {Component, Input, ViewChild} from "@angular/core";

@Component({
  selector: 'accordion',
  templateUrl: 'accordion.html'
})
export class AccordionComponent {

  accordionExapanded = false;
  @ViewChild("cc") cardContent: any;
  @Input('title') title: string;

  icon: string = "md-arrow-dropdown";

  constructor() {
  }


  toggleAccordion() {
    this.accordionExapanded = !this.accordionExapanded;
    this.icon = this.icon == "md-arrow-dropdown" ? "md-arrow-dropup" : "md-arrow-dropdown";
  }

}
