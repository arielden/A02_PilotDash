import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-assembly-form',
  standalone: true,
  templateUrl: './edit-assembly-form.component.html',
  styleUrls: ['./edit-assembly-form.component.css'],
})
export class EditAssemblyFormComponent {
  @Input() assembly: any; // Define el input para recibir datos
}
