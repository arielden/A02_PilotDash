import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import AssemblyComponent from './AssemblyComponent';
import EditAssemblyForm from './EditAssemblyForm'; 
import { DataTable } from "simple-datatables";
import 'simple-datatables/dist/style.css';
import '../css/datatabes_style.css';

const AssemblyTree = () => {
  const [assemblies, setAssemblies] = useState([]);
  const [selectedAssembly, setSelectedAssembly] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dataTable, setDataTable] = useState(null);

  // Cargar los datos al montar el componente
  useEffect(() => {
    const loadAssemblies = async () => {
      try {
        const response = await apiClient.get('/poeassy/assembly/');
        setAssemblies(response.data);
      } catch (error) {
        console.error('Error fetching assemblies:', error);
      }
    };
    loadAssemblies();
  }, []);

  // Inicializar DataTable cada vez que assemblies cambia
  useEffect(() => {
    if (assemblies.length > 0 && !selectedAssembly) {
      initializeDataTable();
    }

    // Limpiar la instancia de DataTable al desmontar el componente o al cambiar de vista
    return () => {
      if (dataTable) {
        dataTable.destroy();
        setDataTable(null); // Asegurarse de resetear la tabla
      }
    };
  }, [assemblies, selectedAssembly]);

  const initializeDataTable = () => {
    const table = document.querySelector("#assemblyTable");
    if (table) {
      const newDataTable = new DataTable(table, {
        searchable: true,
        fixedHeight: true,
        perPage: 10,
        perPageSelect: [5, 10, 15, 20],
      });
      setDataTable(newDataTable);

      // Reasignar los eventos después de la inicialización
      table.querySelectorAll('button').forEach(button => {
        const action = button.innerText;
        const assemblyId = button.getAttribute('data-id');
        if (action === 'Ver') {
          button.addEventListener('click', () => viewAssembly(assemblyId));
        } else if (action === 'Editar') {
          button.addEventListener('click', () => editAssembly(assemblyId));
        } else if (action === 'Eliminar') {
          button.addEventListener('click', () => deleteAssembly(assemblyId));
        }
      });
    }
  };

  const viewAssembly = async (assemblyId) => {
    try {
      const response = await apiClient.get(`/poeassy/assembly/${assemblyId}`);
      setSelectedAssembly(response.data);
    } catch (error) {
      console.error('Error fetching assembly details:', error);
    }
  };

  const returnToTable = () => {
    setSelectedAssembly(null);
    initializeDataTable(); // Reinicializar la tabla al volver
  };

  const editAssembly = (assemblyId) => {
    console.log("Editando assembly:", assemblyId);
    const assembly = assemblies.find(a => a.id === assemblyId);
    setSelectedAssembly(assembly);
    setIsEditing(true); // Cambiar a modo de edición
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedAssembly(null);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    setSelectedAssembly(null);
    // Recargar los datos
    const loadAssemblies = async () => {
      try {
        const response = await apiClient.get('/poeassy/assembly/');
        setAssemblies(response.data);
      } catch (error) {
        console.error('Error fetching assemblies:', error);
      }
    };
    loadAssemblies();
  };

  const deleteAssembly = (assemblyId) => {
    console.log("Eliminando assembly:", assemblyId);
  };

  return (
    <div className="container my-4">
      <h1>Assembly Structure</h1>
      {!selectedAssembly ? (
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-table me-1"></i>
            Assembly Data Table
          </div>
          <div className="card-body">
            <table id="assemblyTable" className="table">
              <thead>
                <tr>
                  <th>Assembly Name</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assemblies.map((assembly) => (
                  <tr key={assembly.id}>
                    <td>{assembly.assembly_name}</td>
                    <td>{assembly.supplier.supplier_name}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        style={{ marginRight: '10px' }}
                        data-id={assembly.id}
                        onClick={() => viewAssembly(assembly.id)}
                      >
                        Ver
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        style={{ marginRight: '10px' }}
                        data-id={assembly.id}
                        onClick={() => editAssembly(assembly.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        style={{ marginRight: '10px' }}
                        data-id={assembly.id}
                        onClick={() => deleteAssembly(assembly.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : isEditing ? (
        <EditAssemblyForm
          assembly={selectedAssembly}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
        />
      ) : (
        <div>
          <AssemblyComponent data={selectedAssembly} />
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={returnToTable}
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
  
};

export default AssemblyTree;
