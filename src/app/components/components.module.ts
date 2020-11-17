import {NgModule} from '@angular/core';
import {ProgressBarComponent} from './progress-bar/progress-bar';
import {KexyBottomNagigationBarComponent} from './kexy-bottom-nagigation-bar/kexy-bottom-nagigation-bar';
import {IonicModule} from '@ionic/angular';
import {AccordionComponent} from './accordion/accordion';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    ProgressBarComponent,
    KexyBottomNagigationBarComponent,
    AccordionComponent,
  ],
    imports: [
        IonicModule,
        CommonModule
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
