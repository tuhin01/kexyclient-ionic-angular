import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppSelectPageRoutingModule } from './app-select-routing.module';

import { AppSelectPage } from './app-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppSelectPageRoutingModule
  ],
  declarations: [AppSelectPage]
})
export class AppSelectPageModule {}
