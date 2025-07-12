import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function LoginForm({ onLogin }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const employees = useSelector(state => state.employees);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    
    // find the employee by email
    const employee = employees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
    
    if (!employee) {
      setError('User not found. Please check your email.');
      return;
    }
    
    // password validation by length : need to update later
    if (password.length < 3) {
      setError('Invalid password.');
      return;
    }
    
    console.log('Login successful:', employee);
    
    // save the user info to localStorage
    localStorage.setItem('currentUser', JSON.stringify(employee));
    
    onLogin(employee);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f5f6f7' }}>
      <Card style={{ minWidth: 350, maxWidth: 400, width: '100%' }}>
        <Card.Body>
          <h3 className="mb-4 text-center fw-bold">Login</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email"
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" variant="success" size="lg">Login</Button>
            </div>
          </Form>
          
          {/* 테스트용 계정 정보 */}
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <strong>Test Accounts:</strong><br/>
              Admin: admin@company.com<br/>
              Employee: john@company.com<br/>
              Password: any 3+ characters
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
} 