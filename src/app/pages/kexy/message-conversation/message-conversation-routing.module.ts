import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessageConversationPage } from './message-conversation.page';

const routes: Routes = [
  {
    path: '',
    component: MessageConversationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageConversationPageRoutingModule {}
