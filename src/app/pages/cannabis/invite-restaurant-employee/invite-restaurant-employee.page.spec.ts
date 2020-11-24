import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InviteRestaurantEmployeePage } from './invite-restaurant-employee.page';

describe('InviteRestaurantEmployeePage', () => {
  let component: InviteRestaurantEmployeePage;
  let fixture: ComponentFixture<InviteRestaurantEmployeePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteRestaurantEmployeePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteRestaurantEmployeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
