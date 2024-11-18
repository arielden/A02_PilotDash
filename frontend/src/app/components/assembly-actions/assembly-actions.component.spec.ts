import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyActionsComponent } from './assembly-actions.component';

describe('AssemblyActionsComponent', () => {
  let component: AssemblyActionsComponent;
  let fixture: ComponentFixture<AssemblyActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssemblyActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblyActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
