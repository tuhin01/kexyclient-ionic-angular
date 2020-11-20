import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlaceOrderPopOverPage } from './place-order-pop-over.page';

describe('PlaceOrderPopOverPage', () => {
  let component: PlaceOrderPopOverPage;
  let fixture: ComponentFixture<PlaceOrderPopOverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceOrderPopOverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceOrderPopOverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
