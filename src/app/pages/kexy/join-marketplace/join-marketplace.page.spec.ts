import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JoinMarketplacePage } from './join-marketplace.page';

describe('JoinMarketplacePage', () => {
  let component: JoinMarketplacePage;
  let fixture: ComponentFixture<JoinMarketplacePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinMarketplacePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JoinMarketplacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
