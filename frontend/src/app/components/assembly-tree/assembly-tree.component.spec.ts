import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyTreeComponent } from './assembly-tree.component';

describe('AssemblyTreeComponent', () => {
  let component: AssemblyTreeComponent;
  let fixture: ComponentFixture<AssemblyTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssemblyTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblyTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
