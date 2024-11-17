import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssemblyFormComponent } from './edit-assembly-form.component';

describe('EditAssemblyFormComponent', () => {
  let component: EditAssemblyFormComponent;
  let fixture: ComponentFixture<EditAssemblyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAssemblyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAssemblyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
