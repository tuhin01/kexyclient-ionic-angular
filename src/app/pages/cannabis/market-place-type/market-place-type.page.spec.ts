import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarketPlaceTypePage } from './market-place-type.page';

describe('MarketPlaceTypePage', () => {
  let component: MarketPlaceTypePage;
  let fixture: ComponentFixture<MarketPlaceTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlaceTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketPlaceTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
