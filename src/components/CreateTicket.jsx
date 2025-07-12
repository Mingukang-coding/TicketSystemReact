import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addTicket, selectEmployees } from '../store';
import { useNavigate } from 'react-router-dom';

export default function CreateTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employees = useSelector(selectEmployees);
  const [form, setForm] = useState({
    title: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
    description: ''
  });
  const [error, setError] = useState('');

  // 최소 마감일 계산 (24시간 후)
  const getMinDueDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    // Due date validation - 최소 24시간 이후
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const due = new Date(form.dueDate);
    if (due < tomorrow) {
      setError('Due date must be at least 24 hours from now.');
      return;
    }
    setError('');
    const newTicket = {
      ...form,
      id: Date.now(),
      assignee: form.assignee ? form.assignee : 'unassigned',
      status: 'open',
    };
    dispatch(addTicket(newTicket));
    navigate('/dashboard');
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f5f6f7' }}>
      <Card style={{ minWidth: 400 }}>
        <Card.Body>
          <h3 className="mb-4 text-center fw-bold">Create Ticket</h3>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={form.title} onChange={handleChange} required placeholder="New Ticket" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              <Form.Select name="assignee" value={form.assignee} onChange={handleChange} >
                <option value="">Select an employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select name="priority" value={form.priority} onChange={handleChange}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control 
                name="dueDate" 
                type="date" 
                value={form.dueDate} 
                onChange={handleChange} 
                min={getMinDueDate()}
                required 
              />
              <Form.Text className="text-muted">
                Due date must be at least 24 hours from now
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter ticket details"
              />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" variant="primary" size="lg">Create</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
} 