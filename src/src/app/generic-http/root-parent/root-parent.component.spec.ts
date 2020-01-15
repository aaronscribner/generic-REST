import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootParentComponent } from './root-parent.component';

describe('RootParentComponent', () => {
  let component: RootParentComponent;
  let fixture: ComponentFixture<RootParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
