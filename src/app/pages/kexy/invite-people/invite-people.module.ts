import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitePeoplePageRoutingModule } from './invite-people-routing.module';

import { InvitePeoplePage } from './invite-people.page';
import {ComponentsModule} from '../../../components/components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        InvitePeoplePageRoutingModule,
        ReactiveFormsModule,
        ComponentsModule
    ],
  declarations: [InvitePeoplePage]
})
export class InvitePeoplePageModule {}
