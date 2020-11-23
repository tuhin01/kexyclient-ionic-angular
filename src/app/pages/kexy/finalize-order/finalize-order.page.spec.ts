import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FinalizeOrderPage } from './finalize-order.page';

describe('FinalizeOrderPage', () => {
  let component: FinalizeOrderPage;
  let fixture: ComponentFixture<FinalizeOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalizeOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FinalizeOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
