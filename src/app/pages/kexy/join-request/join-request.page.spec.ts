import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JoinRequestPage } from './join-request.page';

describe('JoinRequestPage', () => {
  let component: JoinRequestPage;
  let fixture: ComponentFixture<JoinRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JoinRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
