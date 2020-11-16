import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DistributorSelectTypePage } from './distributor-select-type.page';

describe('DistributorSelectTypePage', () => {
  let component: DistributorSelectTypePage;
  let fixture: ComponentFixture<DistributorSelectTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorSelectTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DistributorSelectTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
