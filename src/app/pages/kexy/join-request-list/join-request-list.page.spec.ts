import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JoinRequestListPage } from './join-request-list.page';

describe('JoinRequestListPage', () => {
  let component: JoinRequestListPage;
  let fixture: ComponentFixture<JoinRequestListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinRequestListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JoinRequestListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
