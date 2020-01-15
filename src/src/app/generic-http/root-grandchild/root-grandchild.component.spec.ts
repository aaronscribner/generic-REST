import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootGrandchildComponent } from './root-grandchild.component';

describe('RootGrandchildComponent', () => {
  let component: RootGrandchildComponent;
  let fixture: ComponentFixture<RootGrandchildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootGrandchildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootGrandchildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
