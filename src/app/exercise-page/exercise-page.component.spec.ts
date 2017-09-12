import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisePageComponent } from './exercise-page.component';

describe('ExercisePageComponent', () => {
  let component: ExercisePageComponent;
  let fixture: ComponentFixture<ExercisePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExercisePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
