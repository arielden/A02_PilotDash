import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assembly-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assembly-tree.component.html',
  styleUrls: ['./assembly-tree.component.css'],
})
export class AssemblyTreeComponent {
  @Input() assemblyData: any; // Recibe los datos del ensamblaje seleccionado
}
