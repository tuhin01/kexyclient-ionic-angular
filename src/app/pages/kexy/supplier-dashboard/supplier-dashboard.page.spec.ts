import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupplierDashboardPage } from './supplier-dashboard.page';

describe('SupplierDashboardPage', () => {
  let component: SupplierDashboardPage;
  let fixture: ComponentFixture<SupplierDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
