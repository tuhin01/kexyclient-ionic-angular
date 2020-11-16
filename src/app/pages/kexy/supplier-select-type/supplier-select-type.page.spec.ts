import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupplierSelectTypePage } from './supplier-select-type.page';

describe('SupplierSelectTypePage', () => {
  let component: SupplierSelectTypePage;
  let fixture: ComponentFixture<SupplierSelectTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierSelectTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierSelectTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
