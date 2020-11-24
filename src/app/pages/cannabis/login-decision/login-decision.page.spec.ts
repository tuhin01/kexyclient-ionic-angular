import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginDecisionPage } from './login-decision.page';

describe('LoginDecisionPage', () => {
  let component: LoginDecisionPage;
  let fixture: ComponentFixture<LoginDecisionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDecisionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDecisionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
