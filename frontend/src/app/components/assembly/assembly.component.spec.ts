import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyComponent } from './assembly.component';

describe('AssemblyComponent', () => {
  let component: AssemblyComponent;
  let fixture: ComponentFixture<AssemblyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssemblyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
