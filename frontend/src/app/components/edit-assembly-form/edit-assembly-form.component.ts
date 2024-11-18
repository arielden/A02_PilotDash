import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-edit-assembly-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-assembly-form.component.html',
  styleUrls: ['./edit-assembly-form.component.css'],
})
export class EditAssemblyFormComponent implements OnInit {
  @Input() assembly: any; // Recibe el ensamblaje a editar
  @Output() onCancel = new EventEmitter<void>(); // Evento para cancelar la edición
  @Output() onSave = new EventEmitter<void>(); // Evento para guardar los cambios
  editForm!: FormGroup;
  suppliers: any[] = [];

  constructor(private fb: FormBuilder, private apiClient: ApiClientService) {}

  ngOnInit(): void {
    // Cargar lista de suppliers
    this.apiClient.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
      },
      error: (err) => console.error('Error loading suppliers:', err),
    });
    

    // Inicializa el formulario con los datos del ensamblaje
    this.editForm = this.fb.group({
      assembly_name: [this.assembly?.designation || '', Validators.required],
      part_number: [this.assembly?.partNumber || '', Validators.required],
      indice: [this.assembly?.indice || '', Validators.required],
      version: [this.assembly?.version || '', Validators.required],
      eng_type: [this.assembly?.eng_type || 1, Validators.required],
      supplier: [this.assembly?.supplier?.supplier_name || '', Validators.required],
    });    
  }

  saveChanges(): void {
    if (this.editForm.valid) {
      const updatedAssembly = {
        ...this.assembly,
        ...this.editForm.value, // Incluye el ID del supplier
      };
  
      console.log('Datos enviados al backend:', updatedAssembly); // Verifica los datos actualizados
  
      this.apiClient.put(`${this.assembly.id}`, updatedAssembly).subscribe({
        next: () => {
          console.log('Assembly updated successfully');
          this.onSave.emit(); // Emitir evento al guardar
        },
        error: (err) => {
          console.error('Error updating assembly:', err);
        },
      });
    } else {
      console.warn('Formulario inválido');
    }
  }
  

  cancel(): void {
    this.onCancel.emit(); // Emite el evento al cancelar
  }
}
