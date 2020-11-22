import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageConversationPageRoutingModule } from './message-conversation-routing.module';

import { MessageConversationPage } from './message-conversation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageConversationPageRoutingModule
  ],
  declarations: [MessageConversationPage]
})
export class MessageConversationPageModule {}
