import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RestaurantCreatePage } from './restaurant-create.page';

describe('RestaurantCreatePage', () => {
  let component: RestaurantCreatePage;
  let fixture: ComponentFixture<RestaurantCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
