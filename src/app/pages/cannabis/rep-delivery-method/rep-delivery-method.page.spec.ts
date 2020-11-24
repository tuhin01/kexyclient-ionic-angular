import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RepDeliveryMethodPage } from './rep-delivery-method.page';

describe('RepDeliveryMethodPage', () => {
  let component: RepDeliveryMethodPage;
  let fixture: ComponentFixture<RepDeliveryMethodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepDeliveryMethodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RepDeliveryMethodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
