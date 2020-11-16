import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketPlaceTypePageRoutingModule } from './market-place-type-routing.module';

import { MarketPlaceTypePage } from './market-place-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketPlaceTypePageRoutingModule
  ],
  declarations: [MarketPlaceTypePage]
})
export class MarketPlaceTypePageModule {}
