import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericHttpComponent } from './generic-http.component';

describe('GenericHttpComponent', () => {
  let component: GenericHttpComponent;
  let fixture: ComponentFixture<GenericHttpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericHttpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericHttpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
