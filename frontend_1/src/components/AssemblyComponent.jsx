// AssemblyComponent.jsx

import React, { useEffect } from 'react';
import { DataTable } from "simple-datatables";
import 'simple-datatables/dist/style.css';

const AssemblyComponent = ({ data }) => {
  useEffect(() => {
    const table = document.querySelector("#assemblyDetailsTable");
    let dataTable;

    if (table) {
      dataTable = new DataTable(table, {
        searchable: true,
        fixedHeight: true,
        perPage: 10,
        perPageSelect: [5, 10, 15, 20],
      });
    }

    // Limpiar la instancia de DataTable al desmontar el componente
    return () => {
      if (dataTable && table.contains(dataTable.table)) {
        dataTable.destroy();
      }
    };
  }, [data]);

  if (!data) return <p>No assembly data available</p>;

  return (
    <div className="card mb-4">
      <div className="card-header">
        <i className="fas fa-table me-1"></i>
        {data.assembly_name}
      </div>
      <div className="card-body">
        <table id="assemblyDetailsTable" className="table">
          <thead>
            <tr>
              <th>Designation</th>
              <th>Part Number</th>
              <th>Thickness</th>
              <th>Mass</th>
              <th>Supplier Name</th>
            </tr>
          </thead>
          <tbody>
            {/* Ensamblaje Principal */}
            <tr className="assembly-row">
              <td>{data.assembly_name}</td>
              <td>{data.part_number}</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
            </tr>

            {/* Parts del Ensamblaje Principal */}
            {data.parts?.map((part) => (
              <tr key={part.part.id} className="part-row">
                <td style={{ paddingLeft: '20px' }}>{part.part.designation}</td>
                <td>{part.part.part_number}</td>
                <td>{part.part.thickness}</td>
                <td>{part.part.mass}</td>
                <td>{part.part.supplier.supplier_name}</td>
              </tr>
            ))}

            {/* RMUs del Ensamblaje Principal */}
            {data.rmus?.map((rmu) => (
              <tr key={rmu.rmu.id} className="rmu-row">
                <td style={{ paddingLeft: '20px' }}>{rmu.rmu.designation}</td>
                <td>{rmu.rmu.part_number}</td>
                <td>--</td>
                <td>{rmu.rmu.mass}</td>
                <td>--</td>
              </tr>
            ))}

            {/* Sub-Assemblies */}
            {data.sub_assemblies?.map((subAssembly) => (
              <React.Fragment key={subAssembly.sub_assembly.id}>
                <tr className="sub-assembly-row">
                  <td style={{ paddingLeft: '20px' }}>{subAssembly.sub_assembly.assembly_name}</td>
                  <td>{subAssembly.sub_assembly.part_number}</td>
                  <td>--</td>
                  <td>--</td>
                  <td>--</td>
                </tr>

                {/* Parts del Sub-Assembly */}
                {subAssembly.sub_assembly.parts?.map((part) => (
                  <tr key={part.part.id} className="part-row">
                    <td style={{ paddingLeft: '40px' }}>{part.part.designation}</td>
                    <td>{part.part.part_number}</td>
                    <td>{part.part.thickness}</td>
                    <td>{part.part.mass}</td>
                    <td>{part.part.supplier.supplier_name}</td>
                  </tr>
                ))}

                {/* RMUs del Sub-Assembly */}
                {subAssembly.sub_assembly.rmus?.map((rmu) => (
                  <tr key={rmu.rmu.id} className="rmu-row">
                    <td style={{ paddingLeft: '40px' }}>{rmu.rmu.designation}</td>
                    <td>{rmu.rmu.part_number}</td>
                    <td>--</td>
                    <td>{rmu.rmu.mass}</td>
                    <td>--</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssemblyComponent;
