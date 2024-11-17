import React, { useState } from 'react';
import apiClient from '../api';

const EditAssemblyForm = ({ assembly, onCancel, onSave }) => {
    const [formData, setFormData] = useState({
        assembly_name: assembly.assembly_name || '',
        part_number: assembly.part_number || '',
        indice: assembly.indice || '',
        version: assembly.version || '',
        eng_type: assembly.eng_type || '1', // Valor predeterminado "SET" (1)
      });
      

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `/poeassy/assembly/${assembly.id}`;
  
    try {
      const response = await apiClient.put(url, formData);
      console.log('Update successful:', response.data);
      onSave();
    } catch (error) {
      console.error('Error updating assembly:', error.response || error.message);
    }
  };
  

  return (
    <div className="card mb-4">
      <div className="card-header">Edit Assembly</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="assembly_name" className="form-label">Assembly Name</label>
            <input
              type="text"
              className="form-control"
              id="assembly_name"
              name="assembly_name"
              value={formData.assembly_name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="part_number" className="form-label">Part Number</label>
            <input
              type="text"
              className="form-control"
              id="part_number"
              name="part_number"
              value={formData.part_number}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="indice" className="form-label">Indice</label>
            <input
              type="text"
              className="form-control"
              id="indice"
              name="indice"
              value={formData.indice}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="version" className="form-label">Version</label>
            <input
              type="number"
              className="form-control"
              id="version"
              name="version"
              value={formData.version}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="eng_type" className="form-label">Eng Type</label>
            <select
                className="form-select"
                id="eng_type"
                name="eng_type"
                value={formData.eng_type}
                onChange={handleChange}
            >
                <option value="1">SET</option>
                <option value="2">ASSY</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    </div>
  );
  
};

export default EditAssemblyForm;
