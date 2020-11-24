import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupplierCreatePage } from './supplier-create.page';

describe('SupplierCreatePage', () => {
  let component: SupplierCreatePage;
  let fixture: ComponentFixture<SupplierCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
