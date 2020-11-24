import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReviewOrderPage } from './review-order.page';

describe('ReviewOrderPage', () => {
  let component: ReviewOrderPage;
  let fixture: ComponentFixture<ReviewOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
