// src/components/AssemblyTable.jsx

import React, { useEffect } from 'react';
import 'simple-datatables';

const AssemblyTable = ({ assemblies }) => {
  useEffect(() => {
    const table = document.querySelector("#assemblyTable");
    new window.simpleDatatables.DataTable(table);
  }, []);

  return (
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
              <th>Part Number</th>
              <th>Supplier</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {assemblies.map((assembly) => (
              <tr key={assembly.id}>
                <td>{assembly.assembly_name}</td>
                <td>{assembly.part_number}</td>
                <td>{assembly.supplier_name}</td>
                <td>{assembly.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssemblyTable;
