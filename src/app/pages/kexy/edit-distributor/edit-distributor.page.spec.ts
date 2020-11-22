import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditDistributorPage } from './edit-distributor.page';

describe('EditDistributorPage', () => {
  let component: EditDistributorPage;
  let fixture: ComponentFixture<EditDistributorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDistributorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditDistributorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
