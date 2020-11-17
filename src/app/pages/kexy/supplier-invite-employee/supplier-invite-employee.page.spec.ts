import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupplierInviteEmployeePage } from './supplier-invite-employee.page';

describe('SupplierInviteEmployeePage', () => {
  let component: SupplierInviteEmployeePage;
  let fixture: ComponentFixture<SupplierInviteEmployeePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierInviteEmployeePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierInviteEmployeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
