import {NgModule} from '@angular/core';
import {ProgressBarComponent} from './progress-bar/progress-bar';
import {KexyBottomNagigationBarComponent} from './kexy-bottom-nagigation-bar/kexy-bottom-nagigation-bar';
import {IonicModule} from '@ionic/angular';
import {AccordionComponent} from './accordion/accordion';

@NgModule({
  declarations: [
    ProgressBarComponent,
    KexyBottomNagigationBarComponent,
    AccordionComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ProgressBarComponent,
    KexyBottomNagigationBarComponent,
    AccordionComponent,
  ]
})
export class ComponentsModule {
}

// TODO - Remove if not necessary
