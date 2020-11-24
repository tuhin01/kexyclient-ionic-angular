import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutoCreatedUserUpdatePage } from './auto-created-user-update.page';

describe('AutoCreatedUserUpdatePage', () => {
  let component: AutoCreatedUserUpdatePage;
  let fixture: ComponentFixture<AutoCreatedUserUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCreatedUserUpdatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutoCreatedUserUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
