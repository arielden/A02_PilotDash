import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AssemblyActionsComponent } from '../assembly-actions/assembly-actions.component';
import { EditAssemblyFormComponent } from '../edit-assembly-form/edit-assembly-form.component';

@Component({
  selector: 'app-assembly-tree',
  standalone: true,
  imports: [CommonModule, AgGridModule, EditAssemblyFormComponent],
  templateUrl: './assembly-tree.component.html',
  styleUrls: ['./assembly-tree.component.css'], 
})


export class AssemblyTreeComponent implements OnInit {

  isEditFormVisible = false; // Controla si se muestra el formulario de edición
  selectedAssembly: any = null; // Almacena el ensamblaje seleccionado

  openEditForm(assembly: any): void {
    console.log('Opening edit form for assembly:', assembly); // Depuración
    if (assembly) {
      this.selectedAssembly = assembly; // Asegúrate de que assembly tiene todos los datos
      this.isEditFormVisible = true;
    }
  }  
  
  closeEditForm(): void {
    this.isEditFormVisible = false;   // Oculta el formulario
    this.selectedAssembly = null;    // Limpia el ensamblaje seleccionado
  }

  @Input() assemblyData: any; // Recibe los datos del ensamblaje
  rowData: any[] = []; // Datos para la tabla
  columnDefs: any[] = []; // Configuración de columnas
  defaultColDef: any = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  gridOptions = {
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],
  };

  ngOnInit(): void {
    this.initializeTable();
  }

  // Configuración de las columnas y datos jerárquicos
  initializeTable(): void {
    this.columnDefs = [
      { field: 'designation', headerName: 'Designation', width: 200 },
      { field: 'partNumber', headerName: 'Part Number', width: 180 },
      { field: 'indice', headerName: 'Index', width: 100 },
      { field: 'version', headerName: 'Version', width: 100 },
      { field: 'thickness', headerName: 'Thickness', width: 100 },
      { field: 'mass', headerName: 'Mass', width: 100 },
      { field: 'coef', headerName: 'Coef', width: 100 },
      { field: 'condition', headerName: 'Condition', width: 100 },
      { field: 'supplierName', headerName: 'Supplier Name', width: 180 },
      {
        field: 'actions',
        headerName: 'Actions',
        cellRenderer: AssemblyActionsComponent,
        cellRendererParams: {
          editClicked: (data: any) => this.openEditForm(data),
        },
        width: 180,
      }      
    ];

    // Construir los datos jerárquicos
    this.rowData = this.buildHierarchy(this.assemblyData);
  }

  buildHierarchy(assembly: any): any[] {
    if (!assembly) return [];

    const rows = [];

    // Ensamblaje principal
    rows.push({
      designation: assembly.assembly_name,
      partNumber: assembly.part_number,
      indice: assembly.indice,
      version: assembly.version,
      thickness: '--',
      mass: '--',
      supplierName: assembly.supplier_name,
    });

    // Partes del ensamblaje principal
    assembly.parts?.forEach((part: any) => {
      rows.push({
        designation: part.part.designation,
        partNumber: part.part.part_number,
        indice: part.part.indice,
        version: part.part.version,
        thickness: part.part.thickness,
        mass: part.part.mass,
        coef: part.coef,
        condition: part.part.condition,
        supplierName: part.part.supplier.supplier_name,
      });
    });

    // RMUs
    assembly.rmus?.forEach((rmu: any) => {
      rows.push({
        designation: rmu.rmu.designation,
        partNumber: rmu.rmu.part_number,
        indice: '--',
        version: 0,
        thickness: '--',
        mass: rmu.rmu.mass,
        coef: rmu.coef,
        condition: 'n/a',
        supplierName: '--',
      });
    });

    // Subensamblajes
    assembly.sub_assemblies?.forEach((subAssembly: any) => {
      rows.push({
        designation: subAssembly.sub_assembly.assembly_name,
        partNumber: subAssembly.sub_assembly.part_number,
        indice: subAssembly.sub_assembly.indice,
        version: subAssembly.sub_assembly.version,
        thickness: '--',
        mass: '--',
        coef: subAssembly.coef,
        condition: 'n/a',
        supplierName: '--',
      });

      // Partes del subensamblaje
      subAssembly.sub_assembly.parts?.forEach((part: any) => {
        rows.push({
          designation: part.part.designation,
          partNumber: part.part.part_number,
          indice: part.part.indice,
          version: part.part.version,
          thickness: part.part.thickness,
          mass: part.part.mass,
          coef: part.coef,
          condition: part.part.condition,
          supplierName: part.part.supplier.supplier_name,
        });
      });

      // RMUs del subensamblaje
      subAssembly.sub_assembly.rmus?.forEach((rmu: any) => {
        rows.push({
          designation: rmu.rmu.designation,
          partNumber: rmu.rmu.part_number,
          indice: '--',
          version: 0,
          thickness: '--',
          mass: rmu.rmu.mass,
          coef: rmu.coef,
          condition: 'n/a',
          supplierName: '--',
        });
      });
    });

    return rows;
  }
}
