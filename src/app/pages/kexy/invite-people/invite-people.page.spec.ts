import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvitePeoplePage } from './invite-people.page';

describe('InvitePeoplePage', () => {
  let component: InvitePeoplePage;
  let fixture: ComponentFixture<InvitePeoplePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitePeoplePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvitePeoplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
