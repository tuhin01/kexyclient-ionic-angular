import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditSupplierPage } from './edit-supplier.page';

describe('EditSupplierPage', () => {
  let component: EditSupplierPage;
  let fixture: ComponentFixture<EditSupplierPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSupplierPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSupplierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
