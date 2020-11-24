import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddNewProductPage } from './add-new-product.page';

describe('AddNewProductPage', () => {
  let component: AddNewProductPage;
  let fixture: ComponentFixture<AddNewProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
