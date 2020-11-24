import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinMarketplacePageRoutingModule } from './join-marketplace-routing.module';

import { JoinMarketplacePage } from './join-marketplace.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoinMarketplacePageRoutingModule
  ],
  declarations: [JoinMarketplacePage]
})
export class JoinMarketplacePageModule {}
