import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressPageComponent } from './progress-page.component';

describe('ProgressPageComponent', () => {
  let component: ProgressPageComponent;
  let fixture: ComponentFixture<ProgressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
