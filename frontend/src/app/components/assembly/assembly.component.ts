import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../services/api-client.service';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AssemblyTreeComponent } from '../assembly-tree/assembly-tree.component';

@Component({
  selector: 'app-assembly',
  standalone: true,
  imports: [CommonModule, AgGridModule, AssemblyTreeComponent],
  templateUrl: './assembly.component.html',
  styleUrls: ['./assembly.component.css'],
})
export class AssemblyComponent implements OnInit {
  assemblies: any[] = [];
  columnDefs = [
    { field: 'assembly_name', headerName: 'Assembly Name', width: 200 },
    { field: 'part_number', headerName: 'Part Number', width: 180 },
    { field: 'indice', headerName: 'Index', width: 100 },
    { field: 'version', headerName: 'Version', width: 100 },
    { field: 'supplier.supplier_name', headerName: 'Supplier', width: 180 },
    {
      headerName: 'Actions',
      cellRenderer: this.actionCellRenderer.bind(this),
      width: 180
    },
  ];
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  gridOptions = {
    pagination: true,
    paginationPageSize: 5,
    paginationPageSizeSelector: [5, 10, 20, 50],
  };
  
  selectedAssembly: any = null;

  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.loadAssemblies();
  }

  loadAssemblies(): void {
    this.apiClient.getAssemblies().subscribe({
      next: (data) => (this.assemblies = data),
      error: (err) => console.error('Error fetching assemblies:', err),
    });
  }

  viewAssembly(assemblyId: number): void {
    this.apiClient.getAssembly(assemblyId).subscribe({
      next: (data) => (this.selectedAssembly = data),
      error: (err) => console.error('Error fetching assembly details:', err),
    });
  }

  returnToTable(): void {
    this.selectedAssembly = null;
  }

  actionCellRenderer(params: any): string {
    return `
      <button class="btn btn-outline-primary btn-sm" data-action="view" data-id="${params.data.id}">View</button>
      <button class="btn btn-outline-danger btn-sm" data-action="delete" data-id="${params.data.id}">Delete</button>
    `;
  }

  onGridReady(params: any): void {
    params.api.addEventListener('cellClicked', (event: any) => {

      const action = event.event.target.dataset.action; // Obtiene la acción (view o edit)
      const assemblyId = event.event.target.dataset.id; // Obtiene el ID del ensamblaje
  
      if (action === 'view') {
        this.viewAssembly(assemblyId); // Llama al método para ver detalles
      }
    });
  }
  
}
