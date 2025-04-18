import React, { useState } from 'react';
import { Button, Input, Typography, Select, Option } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

const EmployeeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    document: '',
    is_active: true,
    birth_date: '',
    gender: '',
    eps: '',
    afp: '',
    education: '',
    marital_status: '',
    emergency_contact: '',
    phone_contact: '',
    address: '',
    ethnicity: '',
    socioeconomic_stratum: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees/', formData);
      navigate('/dashboard/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Create New Employee
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
        <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
        <Input label="Document" name="document" value={formData.document} onChange={handleChange} required />
        <Input label="Birth Date" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />

        <Select label="Gender" name="gender" value={formData.gender} onChange={(val) => setFormData({ ...formData, gender: val })}>
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
          <Option value="Other">Other</Option>
        </Select>

        <Input label="EPS" name="eps" value={formData.eps} onChange={handleChange} />
        <Input label="AFP" name="afp" value={formData.afp} onChange={handleChange} />
        <Input label="Education" name="education" value={formData.education} onChange={handleChange} />

        <Select label="Marital Status" name="marital_status" value={formData.marital_status} onChange={(val) => setFormData({ ...formData, marital_status: val })}>
          <Option value="Single">Single</Option>
          <Option value="Married">Married</Option>
          <Option value="Divorced">Divorced</Option>
          <Option value="Widowed">Widowed</Option>
        </Select>

        <Input label="Emergency Contact" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} />
        <Input label="Phone Contact" name="phone_contact" value={formData.phone_contact} onChange={handleChange} />
        <Input label="Address" name="address" value={formData.address} onChange={handleChange} />

        <Select label="Ethnicity" name="ethnicity" value={formData.ethnicity} onChange={(val) => setFormData({ ...formData, ethnicity: val })}>
          <Option value="None">None</Option>
          <Option value="Afro-Colombian">Afro-Colombian</Option>
          <Option value="Indigenous">Indigenous</Option>
          <Option value="ROM">ROM</Option>
          <Option value="Raizal">Raizal</Option>
          <Option value="Other">Other</Option>
        </Select>

        <Select label="Socioeconomic Stratum" name="socioeconomic_stratum" value={formData.socioeconomic_stratum} onChange={(val) => setFormData({ ...formData, socioeconomic_stratum: val })}>
          <Option value="1">1 - Very Low</Option>
          <Option value="2">2 - Low</Option>
          <Option value="3">3 - Medium Low</Option>
          <Option value="4">4 - Medium</Option>
          <Option value="5">5 - Medium High</Option>
          <Option value="6">6 - High</Option>
        </Select>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <label htmlFor="is_active">Active</label>
        </div>

        <Button type="submit" color="blue">
          Save Employee
        </Button>
      </form>
    </div>
  );
};

export default EmployeeForm;

