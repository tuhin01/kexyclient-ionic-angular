import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutoCreatedUserUpdatePageRoutingModule } from './auto-created-user-update-routing.module';

import { AutoCreatedUserUpdatePage } from './auto-created-user-update.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AutoCreatedUserUpdatePageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [AutoCreatedUserUpdatePage]
})
export class AutoCreatedUserUpdatePageModule {}
