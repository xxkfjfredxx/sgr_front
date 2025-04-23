import React, { useState } from 'react';
import { Button, Input, Typography, Spinner } from '@material-tailwind/react';
import { useEmployeeMedicalExams } from '@/hooks/useEmployeeMedicalExams';

const initialForm = {
  exam_type: '',
  date: '',
  entity: '',
  aptitude: '',
  recommendations: '',
  file: null,
};

const examTypeOptions = [
  { value: '', label: 'Seleccionar tipo' },
  { value: 'Ingreso', label: 'Ingreso' },
  { value: 'Periódico', label: 'Periódico' },
  { value: 'Retiro', label: 'Retiro' },
];

const aptitudeOptions = [
  { value: '', label: 'Seleccionar aptitud' },
  { value: 'Apto', label: 'Apto' },
  { value: 'No apto', label: 'No apto' },
];

const EmployeeMedicalExamForm = ({ employeeId }) => {
  const { exams, loading, error, uploadExam } = useEmployeeMedicalExams(employeeId);
  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.exam_type || !form.date || !form.entity || !form.aptitude || !form.file) {
      setFormError('Todos los campos obligatorios deben ser completados.');
      return;
    }

    const formData = new FormData();
    formData.append('employee', employeeId);
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    setUploading(true);
    try {
      await uploadExam(formData);
      setForm(initialForm);
    } catch (err) {
      // el error ya está gestionado en el hook
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Typography variant="h4" className="mb-6">Medical Exams</Typography>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex gap-4">
          <select name="exam_type" value={form.exam_type} onChange={handleChange} className="p-2 border rounded w-full">
            {examTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <Input type="date" name="date" label="Date" value={form.date} onChange={handleChange} />
        </div>
        <div className="flex gap-4">
          <Input name="entity" label="Entity" value={form.entity} onChange={handleChange} />
          <select name="aptitude" value={form.aptitude} onChange={handleChange} className="p-2 border rounded w-full">
            {aptitudeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <Input name="recommendations" label="Recommendations" value={form.recommendations} onChange={handleChange} />
        <Input type="file" name="file" label="Attach PDF" onChange={handleChange} />
        <Button type="submit" color="blue" disabled={uploading || loading}>
          {uploading ? <Spinner className="h-4 w-4" /> : 'Upload Exam'}
        </Button>
        {formError && <div className="text-red-600 text-sm mt-2">{formError}</div>}
      </form>
      <Typography variant="h5" className="mb-3">History</Typography>
      {loading && <Spinner />}
      {error && <div className="text-red-600">{error}</div>}
      {exams.length === 0 && <div className="text-gray-500">No medical exams registered.</div>}
      {exams.map(exam => (
        <div key={exam.id} className="mb-3 p-4 border rounded bg-white shadow">
          <Typography variant="h6">{exam.exam_type} - {exam.date}</Typography>
          <Typography>Entity: {exam.entity} | Aptitude: {exam.aptitude}</Typography>
          <Typography>Recommendations: {exam.recommendations || '-'}</Typography>
          {exam.file && (
            <a href={exam.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View PDF
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmployeeMedicalExamForm;
