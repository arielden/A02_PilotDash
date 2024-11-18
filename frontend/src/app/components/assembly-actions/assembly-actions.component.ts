import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-assembly-actions',
  standalone: true,
  template: `
    <button class="btn btn-outline-secondary btn-sm" (click)="edit()">Edit</button>
    <button class="btn btn-outline-danger btn-sm" (click)="delete()">Delete</button>
  `,
  styleUrls: ['./assembly-actions.component.css'],
})


export class AssemblyActionsComponent {
  @Output() editClicked = new EventEmitter<any>(); 
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  edit(): void {
    console.log('Edit button clicked, emitting event');
    if (this.params.editClicked) {
      this.params.editClicked(this.params.data); // Llama al callback del padre
    } else {
      console.error('editClicked callback is not defined in params');
    }
  }
  

  delete(): void {
    alert(`Delete clicked for: ${this.params.data.designation}`);
  }
}
