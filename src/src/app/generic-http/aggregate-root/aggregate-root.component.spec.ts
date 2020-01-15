import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregateRootComponent } from './aggregate-root.component';

describe('AggregateRootComponent', () => {
  let component: AggregateRootComponent;
  let fixture: ComponentFixture<AggregateRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregateRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregateRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
