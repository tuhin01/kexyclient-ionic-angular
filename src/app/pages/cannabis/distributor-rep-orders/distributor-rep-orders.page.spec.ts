import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DistributorRepOrdersPage } from './distributor-rep-orders.page';

describe('DistributorRepOrdersPage', () => {
  let component: DistributorRepOrdersPage;
  let fixture: ComponentFixture<DistributorRepOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorRepOrdersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DistributorRepOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
