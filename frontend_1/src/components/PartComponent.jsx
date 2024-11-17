import React from 'react';

const PartComponent = ({ data }) => {
  return (
    <div className="part">
      <p>{data.part.designation} ({data.part.part_number})</p>
      <p>Thickness: {data.part.thickness} | Mass: {data.part.mass}</p>
      <p>Supplier Name: {data.part.supplier.supplier_name}</p>
    </div>
  );
};

export default PartComponent;
