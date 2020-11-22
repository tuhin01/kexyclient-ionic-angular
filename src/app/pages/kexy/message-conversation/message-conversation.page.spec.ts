import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MessageConversationPage } from './message-conversation.page';

describe('MessageConversationPage', () => {
  let component: MessageConversationPage;
  let fixture: ComponentFixture<MessageConversationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageConversationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageConversationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
