import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InviteDistributorEmployeePage } from './invite-distributor-employee.page';

describe('InviteDistributorEmployeePage', () => {
  let component: InviteDistributorEmployeePage;
  let fixture: ComponentFixture<InviteDistributorEmployeePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteDistributorEmployeePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteDistributorEmployeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
