import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DistributorCreatePage } from './distributor-create.page';

describe('DistributorCreatePage', () => {
  let component: DistributorCreatePage;
  let fixture: ComponentFixture<DistributorCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DistributorCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
