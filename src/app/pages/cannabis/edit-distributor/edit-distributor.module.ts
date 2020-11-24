import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDistributorPageRoutingModule } from './edit-distributor-routing.module';

import { EditDistributorPage } from './edit-distributor.page';
import {ComponentsModule} from '../../../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EditDistributorPageRoutingModule,
        ReactiveFormsModule,
        ComponentsModule
    ],
  declarations: [EditDistributorPage]
})
export class EditDistributorPageModule {}
