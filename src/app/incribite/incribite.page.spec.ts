import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncribitePage } from './incribite.page';

describe('IncribitePage', () => {
  let component: IncribitePage;
  let fixture: ComponentFixture<IncribitePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncribitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
