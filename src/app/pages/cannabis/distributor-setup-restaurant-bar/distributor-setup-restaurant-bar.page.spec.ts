import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DistributorSetupRestaurantBarPage } from './distributor-setup-restaurant-bar.page';

describe('DistributorSetupRestaurantBarPage', () => {
  let component: DistributorSetupRestaurantBarPage;
  let fixture: ComponentFixture<DistributorSetupRestaurantBarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorSetupRestaurantBarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DistributorSetupRestaurantBarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
